Ext.define('Rambox.view.main.About', {
	 extend: 'Ext.window.Window'
	,xtype: 'about'
	,title: locale['app.about[0]']
	,autoShow: true
	,modal: true
	,resizable: false
	,constrain: true
	,width: 300
	,height: 460
	,bodyPadding: 10
	,data: {
		 version: require('electron').remote.app.getVersion()
		,platform: process.platform
		,arch: process.arch
		,electron: process.versions.electron
		,chromium: process.versions.chrome
		,node: process.versions.node
	}
	,tpl: [
		 '<div style="text-align:center;"><img src="resources/Icon.png" width="100" /></div>'
		,'<div style="text-align:center;"><h3>'+locale['app.about[1]']+'</h3></div>'
		,'<div><b>'+locale['app.about[2]']+':</b> {version}</div>'
		,'<div><b>'+locale['app.about[3]']+':</b> {platform} ({arch})</div>'
		,'<div><b>Electron:</b> {electron}</div>'
		,'<div><b>Chromium:</b> {chromium}</div>'
		,'<div><b>Node:</b> {node}</div>'
		,'<br />'
		,'<div style="text-align:center;"><a href="https://github.com/phischdev/pdhbox" target="_blank">GitHub</a> - <a href="https://diehumanisten.de/" target="_blank">'+'Die Humanisten'+'</a></div>'
		,'<br />'
		,'<div style="text-align:center;"><i>'+locale['app.about[4]']+'</i></div>'
		,'<br />'
		,'<div style="text-align:center;">'+locale['app.about[4.1]']+'</div>'
	]
});
