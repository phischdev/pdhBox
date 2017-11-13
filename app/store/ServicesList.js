Ext.define('Rambox.store.ServicesList', {
	extend: 'Ext.data.Store'
	,alias: 'store.serviceslist'

	,requires: [
		'Ext.data.proxy.LocalStorage'
	]

	,model: 'Rambox.model.ServiceList'

	,proxy: {
		type: 'memory'
	}

	,sorters: [{
		property: 'name'
		,direction: 'ASC'
	}]

	,autoLoad: true
	,autoSync: true
	,pageSize: 100000
	,data: [
		{
			id: 'kix',
			logo: 'kix.png'			,
			name: 'Tickets'			,
			description: 'Ticketsystem.',
			url: 'https://office.diehumanisten.de',
			type: 'mitarbeiter',
			align: 'right',
			editable: false
		},
		{
			id: 'ilias',
			logo: 'ilias.png'			,
			name: 'Ilias'			,
			description: 'Ilias.',
			url: 'https://ilias.diehumanisten.de',
			type: 'mitarbeiter',
			align: 'right',
			editable: false
		},
		{
			id: 'gitlab',
			logo: 'gitlab.png'			,
			name: 'GitLab'			,
			description: 'Codeverwaltung.',
			url: 'https://code.diehumanisten.de',
			type: 'pdh-it',
			align: 'right',
			editable: false
		},
		{
			id: 'trello',
			logo: 'trello.png'			,
			name: 'Trello'			,
			description: 'Infinitely flexible. Incredibly easy to use. Great mobile apps. It\'s free. Trello keeps track of everything, from the big picture to the minute details.',
			url: 'https://trello.com/mitgliederpdh',
			type: 'mitglieder',
			editable: false
		},
		{
			id: 'wiki',
			logo: 'wiki.png'			,
			name: 'Wiki'			,
			url: 'https://wiki.diehumanisten.de/',
			type: 'mitglieder',
			editable: false
		},
		{
			id: 'itwiki',
			logo: 'wiki.png'			,
			name: 'IT-Wiki'			,
			url: '',
			type: 'pdh-it',
			editable: true
		},
		{
			 id: 'slack'
			,logo: 'slack.png'
			,name: 'Slack'
			,editable: false
			,description: locale['services[1]']
			,url: 'https://pgs-diehumanisten.slack.com/'
			,type: 'mitglieder'
			// ,allow_popus: true
			,js_unread: 'function checkUnread(){var e=$(".p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted)").length,a=0;$(".p-channel_sidebar__badge").each(function(){a+=isNaN(parseInt($(this).html()))?0:parseInt($(this).html())}),updateBadge(e,a)}function updateBadge(e,a){var n=a>0?"("+a+") ":e>0?"(•) ":"";document.title=n+originalTitle}var originalTitle=document.title;setInterval(checkUnread,3e3);'
		},
		{
			 id: 'slack2'
			,logo: 'slack.png'
			,name: 'weiteres Slackteam'
			,editable: true
			,description: 'Slack brings all your communication together in one place. It’s real-time messaging, archiving and search for modern teams.'
			,url: 'https://slack.com/intl/de-de/signin'
			,type: 'mitarbeiter'
			,allow_popus: true
			,js_unread: 'function checkUnread(){var e=$(".p-channel_sidebar__channel--unread:not(.p-channel_sidebar__channel--muted)").length,a=0;$(".p-channel_sidebar__badge").each(function(){a+=isNaN(parseInt($(this).html()))?0:parseInt($(this).html())}),updateBadge(e,a)}function updateBadge(e,a){var n=a>0?"("+a+") ":e>0?"(•) ":"";document.title=n+originalTitle}var originalTitle=document.title;setInterval(checkUnread,3e3);'
		},
		{
			id: 'discourse'
			,editable: false
			,logo: 'discourse.png'
			,name: 'Disk'
			,type: 'mitglieder'
			,allow_popups: true
			,url: "https://disk.diehumanisten.de/"
			,js_unread: 'function checkUnread(){var a=0,b=0;document.querySelector(".widget-link.badge-notification.unread-private-messages")&&(a=parseInt(document.querySelector(".widget-link.badge-notification.unread-private-messages").title,10)),document.querySelector(".widget-link.badge-notification.unread-notifications")&&(b=parseInt(document.querySelector(".widget-link.badge-notification.unread-notifications").title,10)),updateBadge(a+b)}function updateBadge(a){document.title=a>=1?"("+a+") "+originalTitle:originalTitle}var originalTitle=document.title;setInterval(checkUnread,3e3);'
		},
		{
			id: 'facebook'
			,logo: 'facebook.png'
			,name: 'Facebook'
			,type: 'mitglieder'
			,url: "https://www.facebook.com/parteiderhumanisten"
			,editable: false
		},
		{
			id: 'gdrive'
			,logo: 'gdrive.png'
			,name: 'Google Drive'
			,type: 'mitarbeiter'
			,url: "https://drive.google.com/drive/"
			,editable: false
			,align: 'right'
		},
		{
			 id: 'hangouts'
			,logo: 'hangouts.png'
			,align: 'right'
			,name: 'Hangouts'
			,description: locale['services[5]']
			,url: 'https://hangouts.google.com/'
			,type: 'mitarbeiter'
			,titleBlink: true
			,manual_notifications: true
			,dont_update_unread_from_title: true
			,js_unread: 'function checkUnread(){updateBadge(document.getElementById("hangout-landing-chat").lastChild.contentWindow.document.body.getElementsByClassName("ee").length)}function updateBadge(e){e>=1?rambox.setUnreadCount(e):rambox.clearUnreadCount()}setInterval(checkUnread,3000);'
		},

		{
			id: 'tweetdeck'
			,logo: 'tweetdeck.png'
			,name: 'TweetDeck'
			,description: locale['services[36]']
			,url: 'https://tweetdeck.twitter.com/'
			,type: 'pdh-presse'
			,align: 'right'
		},
		{
			id: 'custom'
			,logo: 'custom.png'
			,name: '_andere Plattform'
			,description: locale['services[38]']
			,url: '___'
			,type: 'custom'
			,allow_popups: true
		},
		{
			id: 'wordpress'
			,logo: 'wordpress.png'
			,name: 'WordPress'
			,description: 'Add a custom service if is not listed above.'
			,url: 'https://parteiderhumanisten.de/wp2/wp-admin'
			,type: 'pdh-presse'
			,allow_popups: true
			,editable: false
			,align: 'right'
		},
		{
			id: 'reddit'
			,logo: 'reddit.png'
			,name: 'Reddit'
			,description: 'Add a custom service if is not listed above.'
			,url: 'https://reddit.com/r/diehumanisten/'
			,type: 'pdh-presse'
			,editable: false
		},
		{
			id: 'info'
			,logo: 'custom.png'
			,name: 'Info'
			,description: 'Infoseite zu unseren Plattformen'
			,url: 'https://tools.diehumanisten.de'
			,type: 'mitglieder'
			,editable: false
		},
		{
			id: 'roundcube'
			,logo: 'roundcube.png'
			,name: 'Webmail'
			,description: locale['services[42]']
			,url: 'https://webmail.df.eu/roundcube/'
			,type: 'mitarbeiter'
			,align: 'right'
			,js_unread: 'Element.prototype.remove=function(){this.parentElement.removeChild(this)},NodeList.prototype.remove=HTMLCollection.prototype.remove=function(){for(var e=this.length-1;e>=0;e--)this[e]&&this[e].parentElement&&this[e].parentElement.removeChild(this[e])},document.getElementsByClassName("owa-banner").remove(),document.getElementsByTagName("footer").remove(),document.getElementsByTagName("aside").remove(),document.getElementsByTagName("h1").remove();'
			,editable: false
		},
		// {
		// 	id: 'hootsuite'
		// 	,logo: 'hootsuite.png'
		// 	,name: 'Hootsuite'
		// 	,align: 'right'
		// 	,description: 'Enhance your social media management with Hootsuite, the leading social media dashboard. Manage multiple networks and profiles and measure your campaign results.'
		// 	,url: 'https://hootsuite.com/dashboard'
		// 	,type: 'mitarbeiter'
		// },
		// {
		// 	id: 'likeshare'
		// 	,logo: 'wordpress.png'
		// 	,name: 'Like & Share'
		// 	,url: 'https://parteiderhumanisten.de/wp2/like-share/'
		// 	,type: 'mitglieder'
		// 	,allow_popups: true
		// 	,editable: false
		// 	//,removable: false
		// 	,disable_security: true
		// 	,align: 'right'
		// },
  	]
});
