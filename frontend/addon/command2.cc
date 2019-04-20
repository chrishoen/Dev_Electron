#include <napi.h>
#include "napi-thread-safe-callback.hpp"
#include "backend.h"
#include "backendExports.h"

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Saved command2 thread safe callback. This points to a JS callback that
// is to be invoked periodically by the backend dll.

static std::shared_ptr<ThreadSafeCallback> gSavedCommand2CompletionCallback = nullptr;
static std::shared_ptr<ThreadSafeCallback> gSavedCommand2ProgressCallback = nullptr;

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Command2 callback function that is called asynchronously by the 
// backend library in the context of the interface thread command2.
// This calls the saved thread safe callback, which invokes the
// JS callback.

void myCommand2CompletionCallback(int aCode,std::string* aString)
{
  // Call the saved thread safe callback.
  gSavedCommand2CompletionCallback->call([aCode,aString](Napi::Env env, std::vector<napi_value>& args)
  {
    // This will run in main thread and needs to construct the
    // arguments for the call
    args = { Napi::Number::New(env, aCode), Napi::String::New(env, *aString) };

    // Cleanup.
    delete aString;
  });

}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// Command2 callback function that is called asynchronously by the 
// backend library in the context of the interface thread command2.
// This calls the saved thread safe callback, which invokes the
// JS callback.

void myCommand2ProgressCallback(std::string* aString)
{
  // Call the saved thread safe callback.
  gSavedCommand2ProgressCallback->call([aString](Napi::Env env, std::vector<napi_value>& args)
  {
    // This will run in main thread and needs to construct the
    // arguments for the call
    args = { Napi::String::New(env, *aString) };

    // Cleanup.
    delete aString;
  });

}

//******************************************************************************
//******************************************************************************
//******************************************************************************
// the command2 callback.
//
// If this is called with a JS callback as an 
// argument then create a thread safe callback that is based on the JS
// callback, save it as a global variable, and call the backend dll to
// set the command2 callback to the above c++ command2 callback function. The
// backend dll will then periodically call the command2 callback, which will
// then call the saved thread safe callback. 
//
// If this is called with zero arguments then call the backend dll
// to reset the command2 callback.

Napi::Value command2(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();

  // Guard.
  if (info.Length() < 2) {
    Napi::TypeError::New(env, "command2 Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }

  // Get function arguments.
  std::string* arg0 = new std::string(info[0].As<Napi::String>());

  // Save a global thread safe callback based on the passed in
  // JS callback function.
  gSavedCommand2CompletionCallback = std::make_shared<ThreadSafeCallback>(info[1].As<Napi::Function>());
  gSavedCommand2ProgressCallback = std::make_shared<ThreadSafeCallback>(info[2].As<Napi::Function>());

  // call the backend dll.  
  BackEnd::doCommand2(arg0,myCommand2CompletionCallback,myCommand2ProgressCallback);

  // Done.
  return env.Null();
}

