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
        : AsyncWorker(callback)
        {
          SuppressDestruct();
        }

        ~TimerCallbackWorker() {}
    // This code will be executed on the worker thread
    void Execute() {
      estimate = 99.91;
    }

    void OnOK() {
        Napi::HandleScope scope(Env());
        Callback().Call({Env().Undefined(), Napi::Number::New(Env(), estimate)});
    }

    private:
        double estimate;
};

TimerCallbackWorker* gTimerCallbackWorker = 0;

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Timer callback function that is called asynchronously by the 
// backend library in the context of the interface thread timer.

void myTimerCallback(int aCount)
{
  // Launch the async worker to call the JS timee callback function.
  gTimerCallbackWorker->Queue();
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

  // Create a global singular instance of the async worker.
  Napi::Function tCallback = info[0].As<Napi::Function>();
  gTimerCallbackWorker = new TimerCallbackWorker(tCallback);
  gTimerCallbackWorker->SuppressDestruct();

  // Register the callback to the backend interface thread timer.
//BackEnd::setTimerCallback(myTimerCallback);

  // Done.
  return env.Null();
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Function.

Napi::Value testTimerCallback(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  gTimerCallbackWorker->Queue();

  return env.Null();
}
