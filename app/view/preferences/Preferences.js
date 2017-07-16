Ext.define('Rambox.view.preferences.Preferences',{
	 extend: 'Ext.window.Window'
	,xtype: 'preferences'

	,requires: [
		 'Rambox.view.preferences.PreferencesController'
		,'Rambox.view.preferences.PreferencesModel'
		,'Ext.form.field.ComboBox'
		,'Ext.form.field.Checkbox'
	]

	,controller: 'preferences-preferences'
	,viewModel: {
		type: 'preferences-preferences'
	}

	,title: locale['preferences[0]']
	,width: 420
	,modal: true
	,closable: true
	,minimizable: false
	,maximizable: false
	,draggable: true
	,resizable: false
	,buttons: [
		{
			 text: locale['button[1]']
			,ui: 'decline'
			,handler: 'cancel'
		}
		,'->'
		,{
			 text: locale['button[4]']
			,handler: 'save'
		}
	]

	,initComponent: function() {
		var config = ipc.sendSync('getConfig');

		this.items = [
			{
				 xtype: 'form'
				,bodyPadding: 20
				,items: [
					// {
					// 	xtype: 'container'
					// 	,layout: 'hbox'
					// 	,items: [
					// 		{
					// 			 xtype: 'combo'
					// 			,name: 'locale'
					// 			,fieldLabel: 'Language'
					// 			,labelAlign: 'left'
					// 			,flex: 1
					// 			,labelWidth: 80
					// 			,value: config.locale
					// 			,displayField: 'label'
					// 			,valueField: 'value'
					// 			,editable: false
					// 			,store: Ext.create('Ext.data.Store', {
					// 				 fields: ['value', 'label']
					// 				,data: [
					// 					// ,{ 'value': 'en', 'auth0': 'en', 'label': 'English' }
					// 					//,{ 'value': 'de', 'auth0': 'de', 'label': 'German' }
					// 					{ 'value': 'de-humanisten', 'auth0': 'de', 'label': 'Humanistendeutsch' }
					// 				]
					// 			})
					// 		}
					// 		// ,{
					// 		// 	 xtype: 'button'
					// 		// 	,text: 'Help us Translate'
					// 		// 	,style: 'border-top-left-radius:0;border-bottom-left-radius:0;'
					// 		// 	,href: 'https://crowdin.com/project/rambox/invite'
					// 		// }
					// 	]
					// }
					// ,{
					// 	 xtype: 'label'
					// 	,text: 'English is the only language that has full translation. We are working with all the others, help us!'
					// 	,style: 'display:block;font-size:10px;line-height:15px;'
					// 	,margin: '0 0 10 0'
					// }
					,{
						 xtype: 'checkbox'
						,name: 'auto_launch'
						,boxLabel: locale['preferences[5]']
						,value: config.auto_launch
					}
					,{
						 xtype: 'checkbox'
						,name: 'start_minimized'
						,boxLabel: locale['preferences[4]']
						,value: config.start_minimized
					}
					,{
						 xtype: 'checkbox'
						,name: 'hide_menu_bar'
						,boxLabel: locale['preferences[1]']+' (<code>Alt</code> key to display)'
						,value: config.hide_menu_bar
						,hidden: process.platform !== 'win32'
					}
					,{
						 xtype: 'combo'
						,name: 'window_display_behavior'
						,fieldLabel: 'Display behaviour'
						,labelAlign: 'left'
						,width: 380
						,labelWidth: 105
						,value: config.window_display_behavior
						,displayField: 'label'
						,valueField: 'value'
						,editable: false
						,store: Ext.create('Ext.data.Store', {
							 fields: ['value', 'label']
							,data: [
								 { 'value': 'show_taskbar', 'label': 'Show in Taskbar' }
								,{ 'value': 'show_trayIcon', 'label': 'Show Tray Icon' }
								,{ 'value': 'taskbar_tray', 'label': 'Show in Taskbar and Tray Icon' }
							]
						})
						,hidden: process.platform === 'darwin'
					}
					,{
						 xtype: 'combo'
						,name: 'window_close_behavior'
						,fieldLabel: 'When closing the main window'
						,labelAlign: 'left'
						,width: 380
						,labelWidth: 180
						,value: config.window_close_behavior
						,displayField: 'label'
						,valueField: 'value'
						,editable: false
						,store: Ext.create('Ext.data.Store', {
							 fields: ['value', 'label']
							,data: [
								 { 'value': 'keep_in_tray', 'label': 'Keep in tray' }
								,{ 'value': 'keep_in_tray_and_taskbar', 'label': 'Keep in tray and taskbar' }
								,{ 'value': 'quit', 'label': 'Quit' }
							]
						})
						,hidden: process.platform === 'darwin'
					}
					,{
						 xtype: 'checkbox'
						,name: 'always_on_top'
						,boxLabel: 'Always on top'
						,value: config.always_on_top
					}
					,{
						 xtype: 'checkbox'
						,name: 'systemtray_indicator'
						,boxLabel: 'Show System Tray indicator on unread messages'
						,value: config.systemtray_indicator
						,hidden: process.platform === 'darwin'
					}
					,{
						 xtype: 'checkbox'
						,name: 'disable_gpu'
						,boxLabel: 'Disable Hardware Acceleration (needs to relaunch)'
						,value: config.disable_gpu
					}
					,{
						 xtype: 'fieldset'
						,title: 'Master Password - Ask for password on startup'
						,collapsed: !config.master_password
						,checkboxToggle: true
						,checkboxName: 'master_password'
						,margin: '10 0 0 0'
						,padding: 10
						,layout: 'hbox'
						,defaults: { labelAlign: 'top' }
						,items: [
							{
								 xtype: 'textfield'
								,inputType: 'password'
								,fieldLabel: 'Password'
								,name: 'master_password1'
								,itemId: 'pass'
								,flex: 1
								,listeners: {
									validitychange: function(field) {
										field.next().validate();
									},
									blur: function(field) {
										field.next().validate();
									}
								}
							}
							,{
								 xtype: 'textfield'
								,inputType: 'password'
								,fieldLabel: 'Repeat Password'
								,name: 'master_password2'
								,margin: '0 0 0 10'
								,vtype: 'password'
								,initialPassField: 'pass'
								,flex: 1
							}
						]
					}
					,{
						 xtype: 'fieldset'
						,title: 'Proxy (needs to relaunch) - <a href="http://proxylist.hidemyass.com/" target="_blank">Free IP:PORT Proxy List</a>'
						,collapsed: !config.proxy
						,checkboxToggle: true
						,checkboxName: 'proxy'
						,margin: '10 0 0 0'
						,padding: 10
						,layout: 'hbox'
						,defaults: { labelAlign: 'top' }
						,items: [
							{
								 xtype: 'textfield'
								,vtype: 'url'
								,fieldLabel: 'Host'
								,name: 'proxyHost'
								,value: config.proxyHost
								,flex: 1
							}
							,{
								 xtype: 'numberfield'
								,fieldLabel: 'Port'
								,name: 'proxyPort'
								,width: 100
								,value: config.proxyPort
								,margin: '0 0 0 10'
							}
						]
					}
				]
			}
		];

		this.callParent();
	}
});
