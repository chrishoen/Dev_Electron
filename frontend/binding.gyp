{
  "targets": [
    {
      "target_name": "backend",
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "sources": [ "addon/backend.cpp" ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],
      'defines': [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ],
      #begin
      'conditions': [

          ['OS=="win"', {
            "include_dirs": [
              "C:\\MyTools\\MyLib\\node\\"
            ],
            'link_settings': {
              "libraries" : [
                  "C:\\MyTools\\MyLib\\node\\BackEndLib.lib",
                  "C:\\MyTools\\MyLib\\lib\\RisLib.lib",
                  "ws2_32",
                  "winmm"
              ]
            },      
            'defines': [
              'WINDOWS_SPECIFIC_DEFINE',
            ],
          }, { # OS != "win",
            'defines': [
              'NON_WINDOWS_DEFINE',
            ],
          }]
 


      ],
      #end
    }
  ]
}
