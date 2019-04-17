#include <napi.h>
#include "addon.h"

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Napi initialize.

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "add"),
              Napi::Function::New(env, Add));
  exports.Set(Napi::String::New(env, "getCount"),
              Napi::Function::New(env, getCount));
  exports.Set(Napi::String::New(env, "setCount"),
              Napi::Function::New(env, setCount));
  exports.Set(Napi::String::New(env, "callCallback"),
              Napi::Function::New(env, callCallback));
  exports.Set(Napi::String::New(env, "setTimerCallback"),
              Napi::Function::New(env, setTimerCallback));

  BackEnd::initializeBackEnd();
  return exports;
}

NODE_API_MODULE(backend, Init)
