#include <napi.h>
#include "backend.h"
#include "backendExports.h"

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Async worker class.

class TimerCallbackWorker : public Napi::AsyncWorker {
    public:
      TimerCallbackWorker(Napi::Function& callback)
      : AsyncWorker(callback) {}
      ~TimerCallbackWorker() {}
    // This code will be executed on the worker thread
    void Execute() {
      printf("Execute\n");
      estimate = 99.91;
  }

    void OnOK() {
      printf("OnOk\n");
      Napi::HandleScope scope(Env());
      Callback().Call({Napi::Number::New(Env(), estimate)});
    }

    private:
        double estimate;
};

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Timer callback function that is called asynchronously by the 
// backend library in the context of the interface thread timer.

void myTimerCallback(int aCount)
{
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Function.

Napi::Value setTimerCallback(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  // Guard.
  if (info.Length() < 1) {
    Napi::TypeError::New(env, "setTimerCallback Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Launch the async worker to call the JS timee callback function.
  Napi::Function tCallback = info[0].As<Napi::Function>();
  TimerCallbackWorker* tWorker = new TimerCallbackWorker(tCallback);
  tWorker->Queue();

  // Done.
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
