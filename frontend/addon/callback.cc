#include <napi.h>
#include "napi-thread-safe-callback.hpp"
#include "backend.h"
#include "backendExports.h"

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Call a callback.

Napi::Value callCallback1(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "callCallback1 Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  Napi::Function callback = info[0].As<Napi::Function>();
  callback.MakeCallback(env.Global(), { Napi::String::New(env, "hello world from callback") });

  return env.Null();
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Call a callback.

Napi::Value callCallback2(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  // Guard.
  if (info.Length() < 1) {
    Napi::TypeError::New(env, "callCallback2 Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }
  
  // Create a callback.
  std::string tArg0 = "message from callback2";
  auto tCallback = std::make_shared<ThreadSafeCallback>(info[0].As<Napi::Function>());

  // Call the callback.
  tCallback->call([tArg0](Napi::Env env, std::vector<napi_value>& args)
  {
      // This will run in main thread and needs to construct the
      // arguments for the call
      args = { env.Undefined(), Napi::String::New(env, tArg0) };
  });

  // Done.
  return env.Null();
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Call a callback.

Napi::Value callCallback3(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  // Guard.
  if (info.Length() < 1) {
    Napi::TypeError::New(env, "callCallback2 Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }
  
  // Create a callback.
  std::string tArg0 = "message from callback3";
//auto tCallback = std::make_shared<ThreadSafeCallback>(info[0].As<Napi::Function>());
  std::shared_ptr<ThreadSafeCallback> tCallback = std::make_shared<ThreadSafeCallback>(info[0].As<Napi::Function>());

  // Call the callback.
  tCallback->call([tArg0](Napi::Env env, std::vector<napi_value>& args)
  {
      // This will run in main thread and needs to construct the
      // arguments for the call
      args = { Napi::String::New(env, tArg0) };
  });

  // Done.
  return env.Null();
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Save a callback function.

static std::shared_ptr<ThreadSafeCallback> gSavedCallback = nullptr;

Napi::Value saveCallback(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  // Guard.
  if (info.Length() < 1) {
    Napi::TypeError::New(env, "saveCallback Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Save the callback.  
  gSavedCallback = std::make_shared<ThreadSafeCallback>(info[0].As<Napi::Function>());

  // Done.
  return env.Null();
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Call the saved callback.

Napi::Value callSavedCallback(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  
  // Create callback arguments.
  std::string tArg0 = "message from saved callback";

  // Call the saved callback.
  gSavedCallback->call([tArg0](Napi::Env env, std::vector<napi_value>& args)
  {
    // This will run in main thread and needs to construct the
    // arguments for the call
    args = { Napi::String::New(env, tArg0) };
  });

  // Done.
  return env.Null();
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Timer callback function that is called asynchronously by the 
// backend library in the context of the interface thread timer.
// This calls the saved callback.

void myTimerCallback(int aCount)
{
  // Create callback arguments.
  char tArg0[100];
  sprintf(tArg0,"message from saved callback %d",aCount);

  // Call the saved callback.
  gSavedCallback->call([tArg0](Napi::Env env, std::vector<napi_value>& args)
  {
    // This will run in main thread and needs to construct the
    // arguments for the call
    args = { Napi::String::New(env, tArg0) };
  });
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Register the timer callback.

Napi::Value registerTimer(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  // Register the timer callback to the backend dll.  
  BackEnd::setTimerCallback(myTimerCallback);
  // Done.
  return env.Null();
}

