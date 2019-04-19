#include <napi.h>
#include "napi-thread-safe-callback.hpp"
#include "backend.h"
#include "backendExports.h"

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Saved timer thread safe callback. This points to a JS callback that
// is to be invoked periodically by the backend dll.

static std::shared_ptr<ThreadSafeCallback> gSavedTimerCallback = nullptr;

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Timer callback function that is called asynchronously by the 
// backend library in the context of the interface thread timer.
// This calls the saved thread safe callback, which invokes the
// JS callback.

void myTimerCallback(int aCount)
{
  // Create callback arguments.
  char tArg0[100];
  sprintf(tArg0,"backend timer %d",aCount);

  // Call the saved thread safe callback.
  gSavedTimerCallback->call([tArg0](Napi::Env env, std::vector<napi_value>& args)
  {
    // This will run in main thread and needs to construct the
    // arguments for the call
    args = { Napi::String::New(env, tArg0) };
  });
}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Set the timer callback.
//
// If this is called with a JS callback as an 
// argument then create a thread safe callback that is based on the JS
// callback, save it as a global variable, and call the backend dll to
// set the timer callback to the above c++ timer callback function. The
// backend dll will then periodically call the timer callback, which will
// then call the saved thread safe callback. 
//
// If this is called with zero arguments then call the backend dll
// to reset the timer callback.

Napi::Value setTimerCallback(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  // Guard.
  if (info.Length() == 0) {
    BackEnd::resetTimerCallback();
    return env.Null();
  }
  
  // Save a global thread safe callback based in the passed in
  // JS callback function.
  gSavedTimerCallback = std::make_shared<ThreadSafeCallback>(info[0].As<Napi::Function>());

  // Register the timer callback to the backend dll.  
  BackEnd::setTimerCallback(myTimerCallback);

  // Done.
  return env.Null();
}

