#include <napi.h>
#include "backend.h"
#include "backendExports.h"

Napi::Function gTimerCallback;

class EchoWorker : public Napi::AsyncWorker {
    public:
        EchoWorker(Napi::Function& callback)
        : AsyncWorker(callback) {}

        ~EchoWorker() {}
    // This code will be executed on the worker thread
    void Execute() {
      echo = std::string("echo string");
    }

    void OnOK() {
        printf("OnOk\n");
        Napi::HandleScope scope(Env());
        Callback().Call({Env().Null(), Napi::String::New(Env(), "echo string")});
    }

    private:
        std::string echo;

};

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

  EchoWorker* worker = new EchoWorker(gTimerCallback);
  worker->Queue();

  return env.Null();
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Function.

Napi::Value testTimerCallback(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  
  return env.Null();
}
