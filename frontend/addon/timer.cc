#include <napi.h>
#include "backendExports.h"

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

  Napi::Function callback = info[0].As<Napi::Function>();
  callback.MakeCallback(env.Global(), { Napi::String::New(env, "hello world from timer callback") });

  return env.Null();
}
