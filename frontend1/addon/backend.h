#include <napi.h>
#include "backendExports.h"

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Functions exported to nodejs.

Napi::Value finalize(const Napi::CallbackInfo& info);

Napi::Value setCount(const Napi::CallbackInfo& info);
Napi::Value getCount(const Napi::CallbackInfo& info);
Napi::Value setString(const Napi::CallbackInfo& info);
Napi::Value getString(const Napi::CallbackInfo& info);

Napi::Value callCallback1(const Napi::CallbackInfo& info);
Napi::Value callCallback2(const Napi::CallbackInfo& info);
Napi::Value callCallback3(const Napi::CallbackInfo& info);

Napi::Value saveCallback(const Napi::CallbackInfo& info);
Napi::Value callSavedCallback(const Napi::CallbackInfo& info);

Napi::Value setTimerCallback(const Napi::CallbackInfo& info);

Napi::Value command1(const Napi::CallbackInfo& info);
Napi::Value command2(const Napi::CallbackInfo& info);
