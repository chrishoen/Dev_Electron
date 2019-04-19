#include <napi.h>
#include "backend.h"
#include "backendExports.h"

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Function.

Napi::Value finalize(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  // Finalize the back end dll.  
  BackEnd::finalizeBackEnd();

  return env.Null();
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Function.

Napi::Value setCount(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "setCount Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  int arg0 = info[0].As<Napi::Number>().Int32Value();
  BackEnd::setCount(arg0);

  return env.Null();
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Function.

Napi::Value getCount(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  int tCount = 1001;
  tCount = BackEnd::getCount();  
  Napi::Number num = Napi::Number::New(env, tCount);

  return num;
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Function.

Napi::Value setString(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "setString Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  std::string* arg0 = new std::string(info[0].As<Napi::String>());
  BackEnd::setMyString(arg0);

  return env.Null();
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Function.

Napi::Value getString(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  // Get a string from the backend.
  std::string* arg0 = nullptr;
  BackEnd::getMyString(arg0);

  // Set the return value.
  Napi::String tString = Napi::String::New(env,*arg0);

  // Delete the string.
  delete arg0;

  // Done.
  return tString;
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Function.

Napi::Value callCounterCallback(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "callCallback Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  Napi::Function callback = info[0].As<Napi::Function>();
  callback.MakeCallback(env.Global(), { Napi::String::New(env, "hello world from callback") });

  return env.Null();
}
