{
  "targets": [
    {
      "target_name": "addon",
      "sources": [
        "native/src/addon.cpp",
        "native/src/PrinterBuilder.cpp",
        "native/src/PrinterInterface.h"
      ],
      "include_dirs": [
        "<!(node -p \"require('node-addon-api').include\")"
      ],
      "dependencies": [
        "<!(node -p \"require('node-addon-api').targets\"):node_addon_api_except"
      ],
      "conditions": [
        [
          "OS=='win'",
          {
            "sources": ["native/src/PrinterWin.cpp"],
            "defines": ["_WIN32"]
          }
        ],
        [
          "OS!='win'",
          {
            "sources": ["native/src/PrinterPosix.cpp"],
            "libraries": ["-lcups"]
          }
        ]
      ]
    }
  ]
}
