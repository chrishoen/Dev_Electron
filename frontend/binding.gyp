{
  "targets": [
    {
      "target_name": "backend",
      "sources": [
        "addon/backend.cc",
        "addon/counter.cc",
        "addon/timer.cc",
        "addon/callback.cc",
      ],
      "include_dirs": [
        "<!@(node -p \"require('node-addon-api').include\")"
      ],

     'defines': [ 'NAPI_CPP_EXCEPTIONS' ],

     'msvs_settings': {
       'VCCLCompilerTool': { 'ExceptionHandling': 1 },
      },

      #begin
      'conditions': [

          ['OS=="win"', {
            "include_dirs": [
              "C:\\MyTools\\MyLib\\node\\"
            ],
            'link_settings': {
              "libraries" : [
                  "C:\\MyTools\\MyLib\\node\\BackEndDLL.lib",
                  "C:\\MyTools\\MyLib\\lib\\RisLib.lib",
                  "ws2_32",
                  "winmm"
              ]
            },  
            'defines': [ '_HAS_EXCEPTIONS=1' ],
          }, { # OS != "win",
            "cflags!": [ "-fno-exceptions" ],
            "cflags_cc!": [ "-fno-exceptions" ],
            "include_dirs": [
              "/opt/mylib"
            ],
            'link_settings': {
              "libraries" : [
                  "/usr/local/lib/libBackEndDLL.so"
              ]
            },      
          }]

      ],
      #end
    }
  ]
}
