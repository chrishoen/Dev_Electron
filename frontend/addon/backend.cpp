#include <napi.h>
#include "backendExports.h"

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Function.

Napi::Value Add(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 2) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  if (!info[0].IsNumber() || !info[1].IsNumber()) {
    Napi::TypeError::New(env, "Wrong arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  double arg0 = info[0].As<Napi::Number>().DoubleValue();
  double arg1 = info[1].As<Napi::Number>().DoubleValue();
  Napi::Number num = Napi::Number::New(env, arg0 + arg1 + 3.0);

  return num;
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

Napi::Value callCallback(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  if (info.Length() < 1) {
    Napi::TypeError::New(env, "callCallback Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  Napi::Function callback = info[0].As<Napi::Function>();
  callback.MakeCallback(env.Global(), { Napi::String::New(env, "hello world from callback") });

  return env.Null();
}
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
  BackEnd::initializeBackEnd();
  return exports;
}

NODE_API_MODULE(backend, Init)
