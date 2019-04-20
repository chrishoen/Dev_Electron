#include <napi.h>
#include "backend.h"

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Napi initialize.

Napi::Object Init(Napi::Env env, Napi::Object exports) {

  // Setup the exported functions.
  exports.Set(Napi::String::New(env,  "finalize"),
              Napi::Function::New(env, finalize));

  exports.Set(Napi::String::New(env,  "getCount"),
              Napi::Function::New(env, getCount));
  exports.Set(Napi::String::New(env,  "setCount"),
              Napi::Function::New(env, setCount));
  exports.Set(Napi::String::New(env,  "getString"),
              Napi::Function::New(env, getString));
  exports.Set(Napi::String::New(env,  "setString"),
              Napi::Function::New(env, setString));

  exports.Set(Napi::String::New(env,  "callCallback1"),
              Napi::Function::New(env, callCallback1));
  exports.Set(Napi::String::New(env,  "callCallback2"),
              Napi::Function::New(env, callCallback2));
  exports.Set(Napi::String::New(env,  "callCallback3"),
              Napi::Function::New(env, callCallback3));

  exports.Set(Napi::String::New(env,  "saveCallback"),
              Napi::Function::New(env, saveCallback));
  exports.Set(Napi::String::New(env,  "callSavedCallback"),
              Napi::Function::New(env, callSavedCallback));

  exports.Set(Napi::String::New(env,  "setTimerCallback"),
              Napi::Function::New(env, setTimerCallback));

  exports.Set(Napi::String::New(env,  "command1"),
              Napi::Function::New(env, command1));

  // Initialize the backend dll.
  BackEnd::initializeBackEnd();

  // Done.
  return exports;
}

NODE_API_MODULE(backend, Init)
