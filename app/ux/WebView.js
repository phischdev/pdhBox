/**
 * Default config for all webviews created
 */
Ext.define('Rambox.ux.WebView',{
	 extend: 'Ext.panel.Panel'
	,xtype: 'webview'

	,requires: [
		 'Rambox.util.Format'
		,'Rambox.util.Notifier'
		,'Rambox.util.UnreadCounter'
		,'Rambox.util.IconLoader'
	]

	// private
	,zoomLevel: 0
	,currentUnreadCount: 0

	// CONFIG
	,hideMode: 'offsets'
	,initComponent: function(config) {
		var me = this;

		function getLocation(href) {
			var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)(\/[^?#]*)(\?[^#]*|)(#.*|)$/);
			return match && {
				protocol: match[1],
				host: match[2],
				hostname: match[3],
				port: match[4],
				pathname: match[5],
				search: match[6],
				hash: match[7]
			}
		}

		// Allow Custom sites with self certificates
		//if ( me.record.get('trust') ) ipc.send('allowCertificate', me.src);
		allLikeable = me.record.get('type');
		allLikeable = allLikeable === 'twitter' || allLikeable === 'facebook';

		Ext.apply(me, {
			 items: me.webViewConstructor()
			,title: me.record.get('tabname') ? me.record.get('name') : ''
			,icon: me.record.get('type') === 'custom' ? (me.record.get('logo') === '' ? 'resources/icons/custom.png' : me.record.get('logo')) : 'resources/icons/'+me.record.get('logo')
			,src: me.record.get('url')
			,type: me.record.get('type')
			,align: me.record.get('align')
			,notifications: me.record.get('notifications')
			,muted: me.record.get('muted')
			,tabConfig: {
				listeners: {
					afterrender : function( btn ) {
						btn.el.on('contextmenu', function(e) {
							btn.showMenu('contextmenu');
							e.stopEvent();
						});
					}
					,scope: me
				}
				,clickEvent: ''
				,style: !me.record.get('enabled') ? '-webkit-filter: grayscale(1)' : ''
				,menu:  {
					 plain: true
					,items: [
						{
							 xtype: 'toolbar'
							,items: [
								{
									 xtype: 'segmentedbutton'
									,allowToggle: false
									,flex: 1
									,items: [
										{
											 text: 'Zurück'
											,glyph: 'xf053@FontAwesome'
											,flex: 1
											,scope: me
											,handler: me.goBack
										}
										,{
											 text: 'Vorwärts'
											,glyph: 'xf054@FontAwesome'
											,iconAlign: 'right'
											,flex: 1
											,scope: me
											,handler: me.goForward
										}
									]
								}
							]
						}
						,'-'
						,{
							text: locale['app.webview[0]']
							,glyph: 'xf021@FontAwesome'
							,scope: me
							,handler: me.reloadService
						}
						,{
							text: 'Link kopieren'
							,glyph: 'xf0c5@FontAwesome'
							,scope: me
							,handler: me.copyURL
						}
						,'-'
						,{
							 text: 'Reinzoomen'
							,glyph: 'xf00e@FontAwesome'
							,scope: me
							,handler: me.zoomIn
						}
						,{
							 text: 'Rauszoomen'
							,glyph: 'xf010@FontAwesome'
							,scope: me
							,handler: me.zoomOut
						}
						,{
							 text: 'Zoom zurücksetzen'
							,glyph: 'xf002@FontAwesome'
							,scope: me
							,handler: me.resetZoom
						}
						,'-'
						,{
							 text: locale['app.webview[3]']
							,glyph: 'xf121@FontAwesome'
							,scope: me
							,handler: me.toggleDevTools
						},
						{
							text: 'Alles Sichtbare liken :)'
							,scope: me
							,glyph: 'xf087@FontAwesome'
							,hidden: !allLikeable
							,handler: me.likeAll
						}
					]
				}
			}
			,listeners: {
				 afterrender: me.onAfterRender
				,beforedestroy: me.onBeforeDestroy
			}
		});

		if ( me.record.get('statusbar') ) {
			Ext.apply(me, {
				bbar: me.statusBarConstructor(false)
			});
		} else {
			me.items.push(me.statusBarConstructor(true));
		}

		me.callParent(config);
	}

	,onBeforeDestroy: function() {
		var me = this;

		me.setUnreadCount(0);
	}

	,webViewConstructor: function( enabled ) {
		var me = this;

		var cfg;
		enabled = enabled || me.record.get('enabled');

		if ( !enabled ) {
			cfg = {
				 xtype: 'container'
				,html: '<h3>Service Disabled</h3>'
				,style: 'text-align:center;'
				,padding: 100
			};
		} else {
			// const disable_security = me.record.get('disable_security');
			// if (disable_security)
			// 	console.log("disabled security for", me.record.get('type'));
			cfg = [{
				 xtype: 'component'
				,hideMode: 'offsets'
				,autoRender: true
				,autoShow: true
				,autoEl: {
					 tag: 'webview'
					,type: me.record.get('type')
					,src: me.record.get('url')
					,style: 'width:100%;height:100%;visibility:visible;'
					,partition: 'persist:' + me.record.get('type') + '_' + me.id.replace('tab_', '') + (localStorage.getItem('id_token') ? '_' + Ext.decode(localStorage.getItem('profile')).user_id : '')
					,plugins: 'true'
					,allowtransparency: 'on'
					,autosize: 'on'
					,webpreferences: 'allowRunningInsecureContent=yes' //,nativeWindowOpen=yes
					//,disablewebsecurity: 'on' // Disabled because some services (Like Google Drive) dont work with this enabled
					,useragent: Ext.getStore('ServicesList').getById(me.record.get('type')).get('userAgent')
					,preload: './resources/js/rambox-service-api.js'
				}
			}];

			if ( Ext.getStore('ServicesList').getById(me.record.get('type')).get('allow_popups') ) cfg[0].autoEl.allowpopups = 'on';
		}

		return cfg;
	}

	,statusBarConstructor: function(floating) {
		var me = this;

		return {
			 xtype: 'statusbar'
			,hidden: !me.record.get('statusbar')
			,keep: me.record.get('statusbar')
			,y: floating ? '-18px' : 'auto'
			,height: 19
			,dock: 'bottom'
			,defaultText: '<i class="fa fa-check fa-fw" aria-hidden="true"></i> Ready'
			,busyIconCls : ''
			,busyText: '<i class="fa fa-circle-o-notch fa-spin fa-fw"></i> '+locale['app.webview[4]']
			,items: [
				{
					 xtype: 'tbtext'
					,itemId: 'url'
				}
				,{
					 xtype: 'button'
					,glyph: 'xf00d@FontAwesome'
					,scale: 'small'
					,ui: 'decline'
					,padding: 0
					,scope: me
					,disabled: true
					,hidden: floating
					,handler: me.closeStatusBar
					,tooltip: {
						 text: 'Close statusbar until next time'
						,mouseOffset: [0,-60]
					}
				}
			]
		};
	}
	// Humanisten >>>
	,likeAll: function() {
		var me = this;

		var webview = me.getWebView();
		switch (me.record.get('type')) {
			case 'twitter':
				console.log("Liking all Items on Twitter");
				webview.executeJavaScript('document.querySelectorAll("ol.stream-items li.stream-item .tweet:not(.favorited) .content .ProfileTweet-action.ProfileTweet-action--favorite .ProfileTweet-actionButton:not(.ProfileTweet-action--unfavorite)").forEach(b => b.click())');
				break;
			case 'facebook':
				console.log("Liking all Items on Facebook");
				webview.executeJavaScript('document.querySelectorAll(".commentable_item .UFILikeLink").forEach(function (b) {if (b.getAttribute("aria-pressed") === "false") b.click()})');
				break;
		}

	}
	,copyURL: function() {
	 	var me = this;
		if ( !me.record.get('enabled') ) return;

		var webview = me.down('component').el.dom;
	 	const url = webview.src;

		const clipboard = require('electron').clipboard;
		clipboard.writeText(url);
	}
	// Humanisten <<<
	,onAfterRender: function() {
		var me = this;

		if ( !me.record.get('enabled') ) return;

		var webview = me.down('component').el.dom;

		//Humanist <<<
		require('electron-context-menu')({window: webview});
		//Humanist >>>

		// Notifications in Webview
		me.setNotifications(localStorage.getItem('locked') || JSON.parse(localStorage.getItem('dontDisturb')) ? false : me.record.get('notifications'));

		// Show and hide spinner when is loading
		webview.addEventListener("did-start-loading", function() {
			console.info('Start loading...', me.src);
			if ( !me.down('statusbar').closed || !me.down('statusbar').keep ) me.down('statusbar').show();
			me.down('statusbar').showBusy();
		});
		webview.addEventListener("did-stop-loading", function() {
			me.down('statusbar').clearStatus({useDefaults: true});
			if ( !me.down('statusbar').keep ) me.down('statusbar').hide();
			//console.log("did-stop", e);
		});

		webview.addEventListener("did-finish-load", function(e) {
			Rambox.app.setTotalServicesLoaded( Rambox.app.getTotalServicesLoaded() + 1 );
			//console.log("did-finish", e);
			// Apply saved zoom level
			webview.setZoomLevel(me.record.get('zoomLevel'));

			// Set special icon for some service (like Slack)
			Rambox.util.IconLoader.loadServiceIconUrl(me, webview);
		});

		// Open links in default browser
		webview.addEventListener('new-window', function(e) {
			return me.humanistNewWindow(e);
		});

		webview.addEventListener('will-navigate', function(e, url) {
			console.log("wants to navigate", e.url);
			
			var granted = false;

			switch (me.type) {
				case "twitter":
					if (e.url.match('https?:\/\/twitter.com\/')) {
						// Allow
						granted = true;
					}
			}

			if (granted) {
				console.log("granted");
				webview.loadURL(e.url);
			} else {
				console.log("Nope. Preventing navigation");
				e.preventDefault();
			}
		});

		webview.addEventListener("dom-ready", function(e) {
			// Mute Webview
			if ( me.record.get('muted') || localStorage.getItem('locked') || JSON.parse(localStorage.getItem('dontDisturb')) ) me.setAudioMuted(true, true);

			var js_inject = '';
			// Injected code to detect new messages
			if ( me.record ) {
				var js_unread = Ext.getStore('ServicesList').getById(me.record.get('type')).get('js_unread');
				js_unread = js_unread + me.record.get('js_unread');
				if ( js_unread !== '' ) {
					console.groupCollapsed(me.record.get('type').toUpperCase() + ' - JS Injected to Detect New Messages');
					console.info(me.type);
					console.log(js_unread);
					js_inject += js_unread;
				}
			}

			// Prevent Title blinking (some services have) and only allow when the title have an unread regex match: "(3) Title"
			if ( Ext.getStore('ServicesList').getById(me.record.get('type')).get('titleBlink') ) {
				var js_preventBlink = 'var originalTitle=document.title;Object.defineProperty(document,"title",{configurable:!0,set:function(a){null===a.match(new RegExp("[(]([0-9•]+)[)][ ](.*)","g"))&&a!==originalTitle||(document.getElementsByTagName("title")[0].innerHTML=a)},get:function(){return document.getElementsByTagName("title")[0].innerHTML}});';
				console.log(js_preventBlink);
				js_inject += js_preventBlink;
			}

			console.groupEnd();

			// Scroll always to top (bug)
			js_inject += 'document.body.scrollTop=0;';

			// Handles Certificate Errors
			webview.getWebContents().on('certificate-error', function(event, url, error, certificate, callback) {
				if ( me.record.get('trust') ) {
					event.preventDefault();
					callback(true);
				} else {
					callback(false);
				}

				me.down('statusbar').keep = true;
				me.down('statusbar').show();
				me.down('statusbar').setStatus({
					text: '<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Certification Warning'
				});
				me.down('statusbar').down('button').show();
			});

			webview.executeJavaScript(js_inject);
		});

		webview.addEventListener('ipc-message', function(event) {
			var channel = event.channel;
			switch (channel) {
				case 'rambox.setUnreadCount':
					handleSetUnreadCount(event);
					break;
				case 'rambox.clearUnreadCount':
					handleClearUnreadCount(event);
					break;
				case 'rambox.showWindowAndActivateTab':
					showWindowAndActivateTab(event);
					break;
			}

			/**
			 * Handles 'rambox.clearUnreadCount' messages.
			 * Clears the unread count.
			 */
			function handleClearUnreadCount() {
				me.tab.setBadgeText('');
				me.currentUnreadCount = 0;
				me.setUnreadCount(0);
			}

			/**
			 * Handles 'rambox.setUnreadCount' messages.
			 * Sets the badge text if the event contains an integer as first argument.
			 *
			 * @param event
			 */
			function handleSetUnreadCount(event) {
				if (Array.isArray(event.args) === true && event.args.length > 0) {
					var count = event.args[0];
					if (count === parseInt(count, 10)) {
						me.setUnreadCount(count);
					}
				}
			}

			function showWindowAndActivateTab(event) {
				require('electron').remote.getCurrentWindow().show();
				Ext.cq1('app-main').setActiveTab(me);
			}
		});

		/**
		 * Register page title update event listener only for services that don't prevent it by setting 'dont_update_unread_from_title' to true.
		 */
		if (Ext.getStore('ServicesList').getById(me.record.get('type')).get('dont_update_unread_from_title') !== true) {
			webview.addEventListener("page-title-updated", function(e) {
				var count = e.title.match(/\(([^)]+)\)/); // Get text between (...)
				count = count ? count[1] : '0';
				count = count === '•' ? count : Ext.isArray(count.match(/\d+/g)) ? count.match(/\d+/g).join("") : count.match(/\d+/g); // Some services have special characters. Example: (•)
				count = count === null ? '0' : count;

				me.setUnreadCount(count);
			});
		}

		webview.addEventListener('did-get-redirect-request', function( e ) {
			if ( e.isMainFrame && me.record.get('type') === 'tweetdeck' ) Ext.defer(function() { webview.loadURL(e.newURL); }, 1000); // Applied a defer because sometimes is not redirecting. TweetDeck 2FA is an example.
		});

		webview.addEventListener('update-target-url', function( url ) {
			me.down('statusbar #url').setText(url.url);
			//console.log("update-target-url", url.url);
		});
	}

	//Humanisten >>>
	,humanistNewWindow: function (e) {
	 	var me = this;
	 	//console.log("default prevented:", e.defaultPrevented);

		switch (me.type) {
			case 'twitter':
				console.log("from Twitter");
			case 'discourse':
				console.log("from DISK");
				if (e.url.indexOf('auth/facebook?display=popup') > 0) {
					// console.log("facebookauth");
					// me.add({
					// 	xtype: 'window'
					// 	, title: 'Anmelden mit Facebook'
					// 	, width: '80%'
					// 	, height: '80%'
					// 	, maximizable: true
					// 	, modal: true
					// 	, items: {
					// 		xtype: 'component'
					// 		, hideMode: 'offsets'
					// 		, autoRender: true
					// 		, autoShow: true
					// 		, autoEl: {
					// 			tag: 'webview'
					// 			,
					// 			src: e.url
					// 			,
					// 			style: 'width:100%;height:100%;'
					// 			//,partition: 'persist:' + me.record.get('type') + '_' + me.id.replace('tab_', '') + (localStorage.getItem('id_token') ? '_' + Ext.decode(localStorage.getItem('profile')).user_id : '')
					// 			,
					// 			useragent: Ext.getStore('ServicesList').getById(me.record.get('type')).get('userAgent')
					// 		}
					// 	}
					// }).show();
					// e.preventDefault();
					return;
				}
			case 'hangouts':
				e.preventDefault();
				if (e.url.indexOf('plus.google.com/u/0/photos/albums') >= 0) {
					ipc.send('image:popup', e.url, e.target.partition);
					return;
				} else if ( e.url.indexOf('/el/CONVERSATION/') >= 0 ) {
					me.add({
						xtype: 'window'
						, title: 'Video Call'
						, width: '80%'
						, height: '80%'
						, maximizable: true
						, resizable: true
						, draggable: true
						, collapsible: true
						, items: {
							xtype: 'component'
							, hideMode: 'offsets'
							, autoRender: true
							, autoShow: true
							, autoEl: {
								tag: 'webview'
								,
								src: e.url
								,
								style: 'width:100%;height:100%;'
								,
								partition: 'persist:' + me.record.get('type') + '_' + me.id.replace('tab_', '') + (localStorage.getItem('id_token') ? '_' + Ext.decode(localStorage.getItem('profile')).user_id : '')
								,
								useragent: Ext.getStore('ServicesList').getById(me.record.get('type')).get('userAgent')
							}
							, xtype: 'window'
							, title: 'Video Call'
							, width: '80%'
							, height: '80%'
							, maximizable: true
							, resizable: true
							, draggable: true
							, collapsible: true
							, items: {
								xtype: 'component'
								, hideMode: 'offsets'
								, autoRender: true
								, autoShow: true
								, autoEl: {
									tag: 'webview'
									,
									src: e.url
									,
									style: 'width:100%;height:100%;'
									,
									partition: me.getWebView().partition
									,
									useragent: Ext.getStore('ServicesList').getById(me.record.get('type')).get('userAgent')
								}
							}
						}}
					).show();
					return;
				}
				break;
			case 'slack2':
			case 'slack':
				if (e.url.indexOf('slack.com/call/') >= 0) {
					me.add({
						xtype: 'window'
						, title: e.options.title
						, width: e.options.width
						, height: e.options.height
						, maximizable: true
						, resizable: true
						, draggable: true
						, collapsible: true
						, items: {
							xtype: 'component'
							, hideMode: 'offsets'
							, autoRender: true
							, autoShow: true
							, autoEl: {
								tag: 'webview'
								,
								src: e.url
								,
								style: 'width:100%;height:100%;'
								,
								partition: e.options.webPreferences.partition
								,
								useragent: Ext.getStore('ServicesList').getById(me.record.get('type')).get('userAgent')
							},
							xtype: 'window'
							, title: e.options.title
							, width: e.options.width
							, height: e.options.height
							, maximizable: true
							, resizable: true
							, draggable: true
							, collapsible: true
							, items: {
								xtype: 'component'
								, hideMode: 'offsets'
								, autoRender: true
								, autoShow: true
								, autoEl: {
									tag: 'webview'
									,
									src: e.url
									,
									style: 'width:100%;height:100%;'
									,
									partition: me.getWebView().partition
									,
									useragent: Ext.getStore('ServicesList').getById(me.record.get('type')).get('userAgent')
								}
							}
						}
					}).show();
					console.log("preventing default");
					e.preventDefault();
					return;
				} else if (e.url.indexOf('slack-redir.net/') >= 0) {
					var uri = e.url.split('url=')[1];
					uri = decodeURIComponent(uri);
					e.url = uri;
				} else if (e.url.match('https?:\/\/files.slack.com\/')) {
					console.log("Downloading file from Slack", e);
					e.preventDefault();
					require('electron').shell.openExternal(e.url);
					return;
				}
				break;
			case 'wordpress':
				// Link to our site
				if (e.url.indexOf('://parteiderhumanisten.de/wp2/') || e.url.indexOf('://diehumanisten.de/') > 0) {
					if (e.url.indexOf('?preview=true' > 0)) {
						console.log("WP Preview");
						return;
					}
				}
			default:
				break;
		}
		console.log("default prevented:", e.defaultPrevented);


		const protocol = require('url').parse(e.url).protocol;
		if (protocol === 'http:' || protocol === 'https:') {
			console.log("EXTERN", e);

			var selectType = undefined;
			if (e.url.match('https?:\/\/(www)?(m)?.facebook.com\/'))
				selectType = "facebook";
			else if (e.url.match('https?:\/\/twitter.com\/'))
				selectType = "twitter"
			else if (e.url.match('https?:\/\/pgs-diehumanisten.slack.com\/'))
				selectType = "slack";
			else if (e.url.match('https?:\/\/slack.com\/'))
				selectType = "slack2";
			else if (e.url.match('https?:\/\/disk.diehumanisten.de\/'))
				selectType = "discourse";
			else if (e.url.match('https?:\/\/wiki.diehumanisten.de\/'))
				selectType = "wiki";
			else if (e.url.match('https?:\/\/trello.com\/'))
				selectType = "trello";
			else if (e.url.match('https?:\/\/hangouts.google.com\/call\/'))
				selectType = "hangouts_call";
			else if (e.url.match('https?:\/\/hangouts.google.com\/'))
				selectType = "hangouts";
			else if (e.url.match('https?:\/\/(www.)?reddit.com\/'))
				selectType = "reddit";

			// Special case Hangouts
			if (selectType == "hangouts_call")
			{
				// open new window
				console.log("opening new google hangouts window in default browser");
				// console.log(e);
				//e.preventDefault();
				//require('electron').shell.openExternal(e.url);

				return;
			}

			//console.log(me.record.get('type'), selectType);

			if (selectType !== undefined && me.record.get('type') !== selectType) {

				const tabPanel = Ext.cq1('app-main');
				var tabs = tabPanel.items.items;
				console.log("URL:", e.url);
				console.log("Searching:", selectType);
				var tab = tabs.filter(function (tab) {
					if (tab.id === "ramboxTab") return false;
					if (tab.record && tab.record.data) {
						const type = tab.record.data['type'];

						return (type === selectType && true);
					}
					return false;
				});

				// Tab exists
				if (tab.length > 0) {
					tab = tab[0];
					const enabled = tab.record.data["enabled"];
					//console.log(tab);
					//console.log("enabled", enabled);
					if (enabled) {
						//TODO: check if not already there
						//TODO: check if not standard link
						const web = tab.down("component").el.dom;
						web.loadURL(e.url);
					}

					// Select Tab
					// var index = tabPanel.items.indexOf(tab);
					// console.log("index", index);
					tabPanel.setActiveTab(tab);

					// Stop from opening
					e.preventDefault();
					return;
				}
			}
		}
		// Else
		console.log("nichts greift");
		e.preventDefault();
		require('electron').shell.openExternal(e.url);
	}
	//Humanisten <<<

	,setUnreadCount: function(newUnreadCount) {
		var me = this;

		if ( !isNaN(newUnreadCount) && (function(x) { return (x | 0) === x; })(parseFloat(newUnreadCount)) && me.record.get('includeInGlobalUnreadCounter') === true) {
			Rambox.util.UnreadCounter.setUnreadCountForService(me.record.get('id'), newUnreadCount);
		} else {
			Rambox.util.UnreadCounter.clearUnreadCountForService(me.record.get('id'));
		}

		me.setTabBadgeText(Rambox.util.Format.formatNumber(newUnreadCount));

		me.doManualNotification(parseInt(newUnreadCount));
	}

	,refreshUnreadCount: function() {
		this.setUnreadCount(this.currentUnreadCount);
	}

	/**
	 * Dispatch manual notification if
	 * • service doesn't have notifications, so Rambox does them
	 * • count increased
	 * • not in dnd mode
	 * • notifications enabled
	 *
	 * @param {int} count
	 */
	,doManualNotification: function(count) {
		var me = this;

		if (Ext.getStore('ServicesList').getById(me.type).get('manual_notifications') &&
			me.currentUnreadCount < count &&
			me.record.get('notifications') &&
			!JSON.parse(localStorage.getItem('dontDisturb'))) {
				Rambox.util.Notifier.dispatchNotification(me, count);
		}

		me.currentUnreadCount = count;
	}

	/**
	 * Sets the tab badge text depending on the service config param "displayTabUnreadCounter".
	 *
	 * @param {string} badgeText
	 */
	,setTabBadgeText: function(badgeText) {
		var me = this;
		if (me.record.get('displayTabUnreadCounter') === true) {
			me.tab.setBadgeText(badgeText);
		} else {
			me.tab.setBadgeText('');
		}
	}

	/**
	 * Clears the unread counter for this view:
	 * • clears the badge text
	 * • clears the global unread counter
	 */
	,clearUnreadCounter: function() {
		var me = this;
		me.tab.setBadgeText('');
		Rambox.util.UnreadCounter.clearUnreadCountForService(me.record.get('id'));
	}

	,reloadService: function(btn) {
		var me = this;
		var webview = me.down('component').el.dom;

		if ( me.record.get('enabled') ) {
			me.clearUnreadCounter();
			webview.loadURL(me.src);
		}
	}

	,toggleDevTools: function(btn) {
		var me = this;
		var webview = me.down('component').el.dom;

		if ( me.record.get('enabled') ) webview.isDevToolsOpened() ? webview.closeDevTools() : webview.openDevTools();
	}

	,setURL: function(url) {
		var me = this;
		var webview = me.down('component').el.dom;

		me.src = url;

		if ( me.record.get('enabled') ) webview.loadURL(url);
	}

	,setAudioMuted: function(muted, calledFromDisturb) {
		var me = this;
		var webview = me.down('component').el.dom;

		me.muted = muted;

		if ( !muted && !calledFromDisturb && JSON.parse(localStorage.getItem('dontDisturb')) ) return;

		if ( me.record.get('enabled') ) webview.setAudioMuted(muted);
	}

	,closeStatusBar: function() {
		var me = this;

		me.down('statusbar').hide();
		me.down('statusbar').closed = true;
		me.down('statusbar').keep = me.record.get('statusbar');
	}

	,setStatusBar: function(keep) {
		var me = this;

		me.removeDocked(me.down('statusbar'), true);

		if ( keep ) {
			me.addDocked(me.statusBarConstructor(false));
		} else {
			me.add(me.statusBarConstructor(true));
		}
		me.down('statusbar').keep = keep;
	}

	,setNotifications: function(notification, calledFromDisturb) {
		var me = this;
		var webview = me.down('component').el.dom;

		me.notifications = notification;

		if ( notification && !calledFromDisturb && JSON.parse(localStorage.getItem('dontDisturb')) ) return;

		if ( me.record.get('enabled') ) ipc.send('setServiceNotifications', webview.partition, notification);
	}

	,setEnabled: function(enabled) {
		var me = this;

		me.clearUnreadCounter();

		me.removeAll();
		me.add(me.webViewConstructor(enabled));
		if ( enabled ) {
			me.resumeEvent('afterrender');
			me.show();
			me.tab.setStyle('-webkit-filter', 'grayscale(0)');
			me.onAfterRender();
		} else {
			me.suspendEvent('afterrender');
			me.tab.setStyle('-webkit-filter', 'grayscale(1)');
		}
	}

	,goBack: function() {
		var me = this;
		var webview = me.down('component').el.dom;

		if ( me.record.get('enabled') ) webview.goBack();
	}

	,goForward: function() {
		var me = this;
		var webview = me.down('component').el.dom;

		if ( me.record.get('enabled') ) webview.goForward();
	}

	,zoomIn: function() {
		var me = this;
		var webview = me.down('component').el.dom;

		me.zoomLevel = me.zoomLevel + 0.25;
		if ( me.record.get('enabled') ) {
			webview.setZoomLevel(me.zoomLevel);
			me.record.set('zoomLevel', me.zoomLevel);
		}
	}

	,zoomOut: function() {
		var me = this;
		var webview = me.down('component').el.dom;

		me.zoomLevel = me.zoomLevel - 0.25;
		if ( me.record.get('enabled') ) {
			webview.setZoomLevel(me.zoomLevel);
			me.record.set('zoomLevel', me.zoomLevel);
		}
	}

	,resetZoom: function() {
		var me = this;
		var webview = me.down('component').el.dom;

		me.zoomLevel = 0;
		if ( me.record.get('enabled') ) {
			webview.setZoomLevel(0);
			me.record.set('zoomLevel', me.zoomLevel);
		}
	}

	,getWebView: function() {
		if ( this.record.get('enabled') ) {
			return this.down('component').el.dom;
		} else {
			return false;
		}
	}
});
