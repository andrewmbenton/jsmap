var templates = {

  'structure': [
    ['div', {'id':'request-pane', 'class':'pane'}, [
      ['div', {'class':'pane-header'}, 'build a request'],
      ['div', {'class':'pane-content'}, [
        ['div', {'id':'request-builder'},
          ['table', {'id':'ifmap-request-params'}]
        ],
        ['div', {'id':'request-display'}]
      ]]
    ]],
    ['div', {'id':'log-pane', 'class':'pane'}, [
      ['div', {'class':'pane-header'}, 'message log'],
      ['div', {'class':'pane-content'}]
    ]]
  ],
  
  'ifmapRequestParams': [
    ['tr', {'class':'permanent'}, [
      ['td', ['label', 'map server url:']],
      ['td', [
        ['input', {'id':'url', 'name':'url', 'type':'text', 'size':'50'}],
        ['button', {'id':'start', 'class':'extra'}, 'start']
      ]]
    ]],
    ['tr', {'class':'permanent hr'}],
    ['tr', {'class':'permanent'}, [
      ['td', ['label', 'request type:']],
      ['td', [
        ['select', {'id':'ifmap-request-type'}, [
          ['option', {'value':'update'}, 'update'],
          ['option', {'value':'delete'}, 'delete'],
          ['option', {'value':'search'}, 'search'],
          ['option', {'value':'purge'}, 'purge']
        ]],
        ['button', {'id':'submit', 'class':'extra'}, 'submit']
      ]]
    ]],
    ['tr', {'class':'permanent hr'}]
  ],
  
  'identifierRows': [
    ['tr', {'class':'{{class}}'}, [
      ['td', ['label', 'identifier:']],
      ['td', [
        ['select', {'class':'identifier-type'}, [
          ['option', {'value':'access-request'}, 'access-request'],
          ['option', {'value':'device'}, 'device'],
          ['option', {'value':'identity'}, 'identity'],
          ['option', {'value':'ip-address'}, 'ip-address'],
          ['option', {'value':'mac-address'}, 'mac-address']
        ]]
      ]]
    ]],
    ['tr', {'class':'{{class}}'}, [
      ['td', ['label', 'name/value:']],
      ['td', ['input', {'class':'identifier-value', 'name':'identifier-value', 'type':'text', 'size':'50'}]]
    ]],
    ['tr', {'class':'{{class}}'}, [
      ['td', ['label', 'ad:']],
      ['td', ['input', {'class':'identifier-ad', 'name':'identifier-ad', 'type':'text', 'size':'50'}]]
    ]],
    ['tr', {'class':'{{class}} hr'}]
  ],
  
  'metadataRows': [
    ['tr', {'class':'metadata'}, [
      ['td', ['label', 'metadata:']],
      ['td', [
        ['select', {'class':'metadata-type'}, [
          ['option', {'value':'access-request-device'}, 'access-request-device'],
          ['option', {'value':'access-request-ip'}, 'access-request-ip'],
          ['option', {'value':'access-request-mac'}, 'access-request-mac'],
          ['option', {'value':'authenticated-as'}, 'authenticated-as'],
          ['option', {'value':'authenticated-by'}, 'authenticated-by'],
          ['option', {'value':'ip-mac'}, 'ip-mac']
        ]]
      ]]
    ]]
  ],
  
  'paramRow': [
    ['tr', {'class':'{{type}}'}, [
      ['td', ['label', '{{type}}:']],
      ['td', ['input', {'class':'{{type}}-value', 'name':'{{type}}-value', 'type':'text', 'size':'50'}]]
    ]]
  ],
  
  'identitySelector': [
    ['select', {'class':'identity-type extra'}, [
      ['option', {'value':'aik-name'}, 'aik-name'],
      ['option', {'value':'distinguished-name'}, 'distinguished-name'],
      ['option', {'value':'dns-name'}, 'dns-name'],
      ['option', {'value':'email-address'}, 'email-address'],
      ['option', {'value':'kerberos-principal'}, 'kerberos-principal'],
      ['option', {'value':'trusted-platform-module'}, 'trusted-platform-module'],
      ['option', {'value':'username'}, 'username'],
      ['option', {'value':'sip-uri'}, 'sip-uri'],
      ['option', {'value':'tel-uri'}, 'tel-uri']
    ]]
  ]
}
