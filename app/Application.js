Ext.define('Rambox.Application', {
	 extend: 'Ext.app.Application'

	,name: 'Rambox'

	,requires: [
		 'Rambox.ux.Auth0'
		,'Rambox.util.MD5'
		,'Ext.window.Toast'
		,'Ext.util.Cookies'
	]

	,stores: [
		 'ServicesList'
		,'Services'
	]

	,profiles: [
		 'Offline'
		,'Online'
	]

	,config: {
		 totalServicesLoaded: 0
		,totalNotifications: 0
	}

	//Humanisten >>>
	,getStoredServices: function () {
		var stored = Ext.getStore('Services').load();
		stored = stored.data.items;
		stored = stored.map( function (g) {
			return g.data;
		});
		return stored;
	}
	,defaultServices: function () {
		var stored = Ext.getStore('Services').load();
		stored = stored.data.items;
		stored = stored.map( function (g) {
			return g.data;
		});
		//console.log("STORED SERVICES", stored);
		if (stored.length === 0) {
			console.log('KEINE SERVICES');
			const defaults = [
			{
				"position": 1,
				"type": "info",
				"logo": "custom.png",
				"name": "Info",
				"url": "https://tools.diehumanisten.de",
				"align": "left",
				"notifications": true,
				"muted": false,
				"tabname": true,
				"statusbar": true,
				"displayTabUnreadCounter": true,
				"includeInGlobalUnreadCounter": true,
				"trust": true,
				"enabled": true,
				"js_unread": "",
				"zoomLevel": 0,
				"removable": false,
				"editable": true,
				"disable_security": false,
				"id": 11
			}, {
				"position": 2,
				"type": "slack",
				"logo": "slack.png",
				"name": "Slack",
				"url": "https://pgs-diehumanisten.slack.com/",
				"align": "left",
				"notifications": true,
				"muted": false,
				"tabname": true,
				"statusbar": true,
				"displayTabUnreadCounter": true,
				"includeInGlobalUnreadCounter": true,
				"trust": true,
				"enabled": true,
				"js_unread": "",
				"zoomLevel": 0,
				"removable": false,
				"editable": true,
				"disable_security": false,
				"id": 1
			}, {
				"position": 3,
				"type": "trello",
				"logo": "trello.png",
				"name": "Trello",
				"url": "https://trello.com/mitgliederpdh",
				"align": "left",
				"notifications": true,
				"muted": false,
				"tabname": true,
				"statusbar": true,
				"displayTabUnreadCounter": true,
				"includeInGlobalUnreadCounter": true,
				"trust": true,
				"enabled": true,
				"js_unread": "",
				"zoomLevel": 0,
				"removable": false,
				"editable": true,
				"disable_security": false,
				"id": 2
			}, {
				"position": 4,
				"type": "discourse",
				"logo": "discourse.png",
				"name": "Disk",
				"url": "https://disk.diehumanisten.de/",
				"align": "left",
				"notifications": true,
				"muted": false,
				"tabname": true,
				"statusbar": true,
				"displayTabUnreadCounter": true,
				"includeInGlobalUnreadCounter": true,
				"trust": true,
				"enabled": true,
				"js_unread": "",
				"zoomLevel": 0,
				"removable": false,
				"editable": true,
				"disable_security": false,
				"id": 9
			}, {
				"position": 5,
				"type": "wiki",
				"logo": "wiki.png",
				"name": "Wiki",
				"url": "https://wiki.diehumanisten.de/",
				"align": "left",
				"notifications": true,
				"muted": false,
				"tabname": true,
				"statusbar": true,
				"displayTabUnreadCounter": true,
				"includeInGlobalUnreadCounter": true,
				"trust": true,
				"enabled": true,
				"js_unread": "",
				"zoomLevel": 0,
				"removable": true,
				"editable": true,
				"disable_security": false,
				"id": 5
			}, {
				"position": 6,
				"type": "facebook",
				"logo": "facebook.png",
				"name": "Facebook",
				"url": "https://www.facebook.com/parteiderhumanisten",
				"align": "left",
				"notifications": true,
				"muted": false,
				"tabname": true,
				"statusbar": true,
				"displayTabUnreadCounter": true,
				"includeInGlobalUnreadCounter": true,
				"trust": true,
				"enabled": true,
				"js_unread": "",
				"zoomLevel": 0,
				"removable": true,
				"editable": true,
				"disable_security": false,
				"id": 10
			},{
				"position":7,
				"type":"twitter",
				"logo":"twitter.png",
				"name":"Twitter",
				"url":"https://twitter.com/DieHumanisten",
				"align":"left",
				"notifications":true,
				"muted":false,
				"tabname":true,
				"statusbar":true,
				"displayTabUnreadCounter":true,
				"includeInGlobalUnreadCounter":true,
				"trust":true,
				"enabled":true,
				"js_unread":"",
				"zoomLevel":0,
				"removable":true,
				"editable":true,
				"disable_security":false,
				"id":39
			}
			];
			

			defaults.forEach( function(s) {
				var service = Ext.create('Rambox.model.Service', s);
				service.save();
				Ext.getStore('Services').add(service);
			});
			//Ext.cq1('app-main').setActiveTab(0);
			ipc.send('relaunchApp');
		}
	}
	,exportDefaultServices: function () {
		const stored = this.getStoredServices();
		const json = Ext.encode(stored);
		console.log("SERVICES:", json);
	}
	// Humanisten <<<

	,launch: function () {
		// Set Google Analytics events
		// ga_storage._setAccount('UA-80680424-1');
		// ga_storage._trackPageview('/index.html', 'main');
		// ga_storage._trackEvent('Versions', require('electron').remote.app.getVersion());

		// Load language for Ext JS library
		Ext.Loader.loadScript({url: Ext.util.Format.format("ext/packages/ext-locale/build/ext-locale-{0}.js", localStorage.getItem('locale-auth0') || 'en')});


		// Humanisten >>>
		// EXPORT DEFUALT SERVICES
		this.exportDefaultServices();
		this.defaultServices();
		//TODO: Ext.cq1('app-main').doInitialFilter();
		/// Humanisten <<<

		// Initialize Auth0
		// if ( auth0Cfg.clientID !== '' && auth0Cfg.domain !== '' ) Rambox.ux.Auth0.init();

		// Set cookies to help Tooltip.io messages segmentation
		Ext.util.Cookies.set('version', require('electron').remote.app.getVersion());
		if ( Ext.util.Cookies.get('auth0') === null ) Ext.util.Cookies.set('auth0', false);

		// Check for updates
		// if ( require('electron').remote.process.argv.indexOf('--without-update') === -1 ) Rambox.app.checkUpdate(true);

		// Add shortcuts to switch services using CTRL + Number
		var map = new Ext.util.KeyMap({
			 target: document
			,binding: [
				{
					 key: "\t"
					,ctrl: true
					,alt: false
					,shift: false
					,handler: function(key) {
						var tabPanel = Ext.cq1('app-main');
						var activeIndex = tabPanel.items.indexOf(tabPanel.getActiveTab());
						var i = activeIndex + 1;

						// "cycle" (go to the start) when the end is reached or the end is the spacer "tbfill"
						if (i === tabPanel.items.items.length || i === tabPanel.items.items.length - 1 && tabPanel.items.items[i].id === 'tbfill') i = 0;

						// skip spacer
						while (tabPanel.items.items[i].id === 'tbfill') i++;

						tabPanel.setActiveTab(i);
					}
				}
				,{
					 key: "\t"
					,ctrl: true
					,alt: false
					,shift: true
					,handler: function(key) {
						var tabPanel = Ext.cq1('app-main');
						var activeIndex = tabPanel.items.indexOf(tabPanel.getActiveTab());
						var i = activeIndex - 1;
						if ( i < 0 ) i = tabPanel.items.items.length - 1;
						while ( tabPanel.items.items[i].id === 'tbfill' || i < 0 ) i--;
						tabPanel.setActiveTab( i );
					}
				}
				,{
					 key: Ext.event.Event.PAGE_DOWN
					,ctrl: true
					,alt: false
					,shift: false
					,handler: function(key) {
						var tabPanel = Ext.cq1('app-main');
						var activeIndex = tabPanel.items.indexOf(tabPanel.getActiveTab());
						var i = activeIndex + 1;

						// "cycle" (go to the start) when the end is reached or the end is the spacer "tbfill"
						if (i === tabPanel.items.items.length || i === tabPanel.items.items.length - 1 && tabPanel.items.items[i].id === 'tbfill') i = 0;

						// skip spacer
						while (tabPanel.items.items[i].id === 'tbfill') i++;

						tabPanel.setActiveTab(i);
					}
				}
				,{
					 key: Ext.event.Event.PAGE_UP
					,ctrl: true
					,alt: false
					,shift: false
					,handler: function(key) {
						var tabPanel = Ext.cq1('app-main');
						var activeIndex = tabPanel.items.indexOf(tabPanel.getActiveTab());
						var i = activeIndex - 1;
						if ( i < 0 ) i = tabPanel.items.items.length - 1;
						while ( tabPanel.items.items[i].id === 'tbfill' || i < 0 ) i--;
						tabPanel.setActiveTab( i );
					}
				}
				,{
					 key: [Ext.event.Event.NUM_PLUS, Ext.event.Event.NUM_MINUS, 187, 189]
					,ctrl: true
					,alt: false
					,shift: false
					,handler: function(key) {
						var tabPanel = Ext.cq1('app-main');
						if ( tabPanel.items.indexOf(tabPanel.getActiveTab()) === 0 ) return false;

						key === Ext.event.Event.NUM_PLUS || key === 187 ? tabPanel.getActiveTab().zoomIn() : tabPanel.getActiveTab().zoomOut();
					}
				}
				,{
					 key: [Ext.event.Event.NUM_ZERO, '0']
					,ctrl: true
					,alt: false
					,shift: false
					,handler: function(key) {
						var tabPanel = Ext.cq1('app-main');
						if ( tabPanel.items.indexOf(tabPanel.getActiveTab()) === 0 ) return false;

						tabPanel.getActiveTab().resetZoom();
					}
				}
				,{
					 key: "123456789"
					,ctrl: true
					,alt: false
					,handler: function(key) {
						key = key - 48;
						if ( key >= Ext.cq1('app-main').items.indexOf(Ext.getCmp('tbfill')) ) key++;
						Ext.cq1('app-main').setActiveTab(key);
					}
				}
				,{
					 key: 188 // comma
					,ctrl: true
					,alt: false
					,handler: function(key) {
						Ext.cq1('app-main').setActiveTab(0);
					}
				}
				,{
					 key: Ext.event.Event.F1
					,ctrl: false
					,alt: false
					,shift: false
					,handler: function(key) {
						var btn = Ext.getCmp('disturbBtn');
						btn.toggle();
						Ext.cq1('app-main').getController().dontDisturb(btn, true);
					}
				}
				,{
					 key: Ext.event.Event.F2
					,ctrl: false
					,alt: false
					,shift: false
					,handler: function(key) {
						var btn = Ext.getCmp('lockRamboxBtn');
						Ext.cq1('app-main').getController().lockRambox(btn);
					}
				}
			]
		});

		// Mouse Wheel zooming
		document.addEventListener('mousewheel', function(e) {
			if( e.ctrlKey ) {
				var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

				var tabPanel = Ext.cq1('app-main');
				if ( tabPanel.items.indexOf(tabPanel.getActiveTab()) === 0 ) return false;

				if ( delta === 1 ) { // Zoom In
					tabPanel.getActiveTab().zoomIn();
				} else { // Zoom Out
					tabPanel.getActiveTab().zoomOut();
				}
			}
		});

		// Define default value
		if ( localStorage.getItem('dontDisturb') === null ) localStorage.setItem('dontDisturb', false);
		ipc.send('setDontDisturb', localStorage.getItem('dontDisturb')); // We store it in config

		if ( localStorage.getItem('locked') ) {
			console.info('Lock Rambox:', 'Enabled');
			Ext.cq1('app-main').getController().showLockWindow();
		}

		// Remove spinner
		Ext.get('spinner').destroy();
	}

	,updateTotalNotifications: function( newValue, oldValue ) {
		newValue = parseInt(newValue);
		if ( newValue > 0 )	{
			if ( Ext.cq1('app-main').getActiveTab().record ) {
				document.title = 'HumanistenBox (' + Rambox.util.Format.formatNumber(newValue) + ') - '+Ext.cq1('app-main').getActiveTab().record.get('name');
			} else {
				document.title = 'HumanistenBox (' + Rambox.util.Format.formatNumber(newValue) + ')';
			}
		} else {
			if ( Ext.cq1('app-main') && Ext.cq1('app-main').getActiveTab().record ) {
				document.title = 'HumanistenBox - '+Ext.cq1('app-main').getActiveTab().record.get('name');
			} else {
				document.title = 'HumanistenBox';
			}
		}
	}

	,checkUpdate: function(silence) {
		console.info('Checking for updates...');
		// Ext.Ajax.request({
		// 	 url: 'http://rambox.pro/api/latestversion.json'
		// 	,method: 'GET'
		// 	,success: function(response) {
		// 		var json = Ext.decode(response.responseText);
		// 		var appVersion = new Ext.Version(require('electron').remote.app.getVersion());
		// 		if ( appVersion.isLessThan(json.version) ) {
		// 			console.info('New version is available', json.version);
		// 			Ext.cq1('app-main').addDocked({
		// 				 xtype: 'toolbar'
		// 				,dock: 'top'
		// 				,ui: 'newversion'
		// 				,items: [
		// 					'->'
		// 					,{
		// 						 xtype: 'label'
		// 						,html: '<b>'+locale['app.update[0]']+'</b> ('+json.version+')' + ( process.platform === 'win32' ? ' Is downloading in the background and you will notify when is ready to install it.' : '' )
		// 					}
		// 					,{
		// 						 xtype: 'button'
		// 						,text: locale['app.update[1]']
		// 						,href: process.platform === 'darwin' ? 'https://getrambox.herokuapp.com/download/'+process.platform+'_'+process.arch : 'https://github.com/saenzramiro/rambox/releases/latest'
		// 						,hidden: process.platform === 'win32'
		// 					}
		// 					,{
		// 						 xtype: 'button'
		// 						,text: locale['app.update[2]']
		// 						,ui: 'decline'
		// 						,tooltip: 'Click here to see more information about the new version.'
		// 						,href: 'https://github.com/saenzramiro/rambox/releases/tag/'+json.version
		// 					}
		// 					,'->'
		// 					,{
		// 						 glyph: 'xf00d@FontAwesome'
		// 						,baseCls: ''
		// 						,style: 'cursor:pointer;'
		// 						,handler: function(btn) { Ext.cq1('app-main').removeDocked(btn.up('toolbar'), true); }
		// 					}
		// 				]
		// 			});
		// 			if ( process.platform === 'win32' ) ipc.send('autoUpdater:check-for-updates');
		// 			return;
		// 		} else if ( !silence ) {
		// 			Ext.Msg.show({
		// 				 title: locale['app.update[3]']
		// 				,message: locale['app.update[4]']
		// 				,icon: Ext.Msg.INFO
		// 				,buttons: Ext.Msg.OK
		// 			});
		// 		}
		// 		console.info('Your version is the latest. No need to update.');
		// 	}
		// });
	}
});
