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
			name: 'Kix'			,
			description: 'Ticketsystem.',
			url: 'https://office.diehumanisten.de',
			type: 'mitarbeiter',
			editable: false
		},
		{
			id: 'gitlab',
			logo: 'gitlab.png'			,
			name: 'GitLab'			,
			description: 'Codeverwaltung.',
			url: 'https://code.diehumanisten.de',
			type: 'mitarbeiter',
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
			type: 'mitarbeiter',
			editable: true
		},
		{
			 id: 'slack'
			,logo: 'slack.png'
			,name: 'Slack'
			,editable: false
			,description: 'Slack brings all your communication together in one place. It’s real-time messaging, archiving and search for modern teams.'
			,url: 'https://pgs-diehumanisten.slack.com/'
			,type: 'mitglieder'
			,allow_popus: true
			,js_unread: 'function checkUnread(){var a=0,b=0;$(".unread_msgs").each(function(){a+=isNaN(parseInt($(this).html())) ? 0 : parseInt($(this).html())}),$(".unread_highlights").each(function(){b+=isNaN(parseInt($(this).html())) ? 0 : parseInt($(this).html())}),updateBadge(a,b)}function updateBadge(a,b){var c=b>0?"("+b+") ":a>0?"(•) ":"";document.title=c+originalTitle}var originalTitle=document.title;setInterval(checkUnread,3000);'
		},
		{
			 id: 'slack2'
			,logo: 'slack.png'
			,name: 'weiteres Slackteam'
			,editable: true
			,description: 'Slack brings all your communication together in one place. It’s real-time messaging, archiving and search for modern teams.'
			,url: 'https://slack.com/'
			,type: 'mitarbeiter'
			,allow_popus: true
			,js_unread: 'function checkUnread(){var a=0,b=0;$(".unread_msgs").each(function(){a+=isNaN(parseInt($(this).html())) ? 0 : parseInt($(this).html())}),$(".unread_highlights").each(function(){b+=isNaN(parseInt($(this).html())) ? 0 : parseInt($(this).html())}),updateBadge(a,b)}function updateBadge(a,b){var c=b>0?"("+b+") ":a>0?"(•) ":"";document.title=c+originalTitle}var originalTitle=document.title;setInterval(checkUnread,3000);'
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
			,description: 'Hangouts bring conversations to life with photos, emoji, and even group video calls for free. Connect with friends across computers, Android, and Apple devices.'
			,url: 'https://hangouts.google.com/'
			,type: 'mitarbeiter'
			,titleBlink: true
			,manual_notifications: true
			,js_unread: 'function checkUnread(){updateBadge(document.getElementById("hangout-landing-chat").lastChild.contentWindow.document.body.getElementsByClassName("ee").length)}function updateBadge(e){e>=1?rambox.setUnreadCount(e):rambox.clearUnreadCount()}setInterval(checkUnread,3000);'
			//,js_unread: 'function checkUnread(){updateBadge(document.getElementById("hangout-landing-chat").lastChild.contentWindow.document.body.getElementsByClassName("ee").length)}function updateBadge(e){e>=1?document.title="("+e+") "+originalTitle:document.title=originalTitle}var originalTitle=document.title;setInterval(checkUnread,3000);'
		},

		{
			id: 'tweetdeck'
			,logo: 'tweetdeck.png'
			,name: 'TweetDeck'
			,description: 'TweetDeck is a social media dashboard application for management of Twitter accounts.'
			,url: 'https://tweetdeck.twitter.com/'
			,type: 'mitarbeiter'
			,align: 'right'
		},
		{
			id: 'custom'
			,logo: 'custom.png'
			,name: '_andere Plattform'
			,description: 'Add a custom service if is not listed above.'
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
			,type: 'mitarbeiter'
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
			,type: 'mitarbeiter'
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
			,description: 'Free and open source webmail software for the masses, written in PHP.'
			,url: 'https://webmail.df.eu/roundcube/'
			,editable: false
			,type: 'mitarbeiter'
			,align: 'right'
			,js_unread: 'Element.prototype.remove=function(){this.parentElement.removeChild(this)},NodeList.prototype.remove=HTMLCollection.prototype.remove=function(){for(var e=this.length-1;e>=0;e--)this[e]&&this[e].parentElement&&this[e].parentElement.removeChild(this[e])},document.getElementsByClassName("owa-banner").remove(),document.getElementsByTagName("footer").remove(),document.getElementsByTagName("aside").remove(),document.getElementsByTagName("h1").remove();'
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
