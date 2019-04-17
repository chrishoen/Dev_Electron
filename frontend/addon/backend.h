#include <napi.h>
#include "backendExports.h"

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Functions exported to nodejs.

Napi::Value Add(const Napi::CallbackInfo& info);
Napi::Value getCount(const Napi::CallbackInfo& info);
Napi::Value setCount(const Napi::CallbackInfo& info);
Napi::Value callCallback(const Napi::CallbackInfo& info);
Napi::Value setTimerCallback(const Napi::CallbackInfo& info);
Napi::Value testTimerCallback(const Napi::CallbackInfo& info);

