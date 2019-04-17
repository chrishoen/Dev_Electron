#include <napi.h>
#include "backend.h"
#include "backendExports.h"

Napi::Function gTimerCallback;

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Function.

Napi::Value setTimerCallback(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "setTimerCallback Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }
  
  gTimerCallback = info[0].As<Napi::Function>();

  return env.Null();
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Function.

Napi::Value testTimerCallback(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

//  gTimerCallback.MakeCallback(env.Global(), { Napi::String::New(env, "hello world from test timer callback") });

  return env.Null();
}
