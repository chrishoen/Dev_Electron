#include <napi.h>
#include "backend.h"

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Napi initialize.

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "finalize"),
              Napi::Function::New(env, finalize));
  exports.Set(Napi::String::New(env, "add"),
              Napi::Function::New(env, Add));
  exports.Set(Napi::String::New(env, "getCount"),
              Napi::Function::New(env, getCount));
  exports.Set(Napi::String::New(env, "setCount"),
              Napi::Function::New(env, setCount));
  exports.Set(Napi::String::New(env, "callCounterCallback"),
              Napi::Function::New(env, callCounterCallback));
  exports.Set(Napi::String::New(env, "setTimerCallback"),
              Napi::Function::New(env, setTimerCallback));
  exports.Set(Napi::String::New(env, "testTimerCallback"),
              Napi::Function::New(env, testTimerCallback));

  exports.Set(Napi::String::New(env, "callCallback1"),
              Napi::Function::New(env, callCallback1));
  exports.Set(Napi::String::New(env, "callCallback2"),
              Napi::Function::New(env, callCallback2));
  exports.Set(Napi::String::New(env, "callCallback3"),
              Napi::Function::New(env, callCallback3));


  BackEnd::initializeBackEnd();
  return exports;
}

NODE_API_MODULE(backend, Init)
