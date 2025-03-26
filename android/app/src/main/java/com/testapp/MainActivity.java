package com.testapp;
import android.view.KeyEvent; // <--- import
import android.os.Bundle;
import com.github.kevinejohn.keyevent.KeyEventModule; // <--- import
import com.facebook.react.ReactActivity;
import com.facebook.react.ReactActivityDelegate;
import com.facebook.react.ReactRootView;
import android.content.Intent;
import android.content.res.Configuration;
import org.devio.rn.splashscreen.SplashScreen;
import android.util.Log;
import android.content.Context;
import android.app.UiModeManager;
public class MainActivity extends ReactActivity {
  private boolean isAndroidTV;
  @Override
  protected void onCreate(Bundle savedInstanceState) {
      // SplashScreen.show(this);  // here
           // Check if the device is Android TV
           UiModeManager uiModeManager = (UiModeManager) getSystemService(Context.UI_MODE_SERVICE);
           isAndroidTV = uiModeManager.getCurrentModeType() == Configuration.UI_MODE_TYPE_TELEVISION;
   
           // Log to verify if it's running on Android TV
           Log.d("MainActivity", "Is this an Android TV? " + isAndroidTV);
      super.onCreate(savedInstanceState);
  }

     @Override
   public void onConfigurationChanged(Configuration newConfig) {
       super.onConfigurationChanged(newConfig);
       Intent intent = new Intent("onConfigurationChanged");
       intent.putExtra("newConfig", newConfig);
       this.sendBroadcast(intent);
   }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "TestApp";
  }
 

  /**
   * Returns the instance of the {@link ReactActivityDelegate}. There the RootView is created and
   * you can specify the renderer you wish to use - the new renderer (Fabric) or the old renderer
   * (Paper).
   */
  @Override
  protected ReactActivityDelegate createReactActivityDelegate() {
    return new MainActivityDelegate(this, getMainComponentName());
  }

  @Override
  public boolean onKeyDown(int keyCode, KeyEvent event) {
      // Run key event handling code only on Android TV
      if (isAndroidTV) {
          if (event.getRepeatCount() == 0) {
              KeyEventModule.getInstance().onKeyDownEvent(keyCode, event);
          }
          return super.onKeyDown(keyCode, event);
      }
      // If not Android TV, pass the event to the default handler
      return super.onKeyDown(keyCode, event);
  }

  @Override
  public boolean onKeyUp(int keyCode, KeyEvent event) {
      if (isAndroidTV) {
          KeyEventModule.getInstance().onKeyUpEvent(keyCode, event);
          return super.onKeyUp(keyCode, event);
      }
      return super.onKeyUp(keyCode, event);
  }

  @Override
  public boolean onKeyMultiple(int keyCode, int repeatCount, KeyEvent event) {
      if (isAndroidTV) {
          KeyEventModule.getInstance().onKeyMultipleEvent(keyCode, repeatCount, event);
          return super.onKeyMultiple(keyCode, repeatCount, event);
      }
      return super.onKeyMultiple(keyCode, repeatCount, event);
  }

  @Override
  public boolean dispatchKeyEvent(KeyEvent event) {
      if (isAndroidTV && (event.getKeyCode() == KeyEvent.KEYCODE_ENTER || event.getKeyCode() == KeyEvent.KEYCODE_DPAD_CENTER) && event.getAction() == KeyEvent.ACTION_DOWN) {
          KeyEventModule.getInstance().onKeyDownEvent(event.getKeyCode(), event);
          return false;
      }
      return super.dispatchKeyEvent(event);
  }
  public static class MainActivityDelegate extends ReactActivityDelegate {
    public MainActivityDelegate(ReactActivity activity, String mainComponentName) {
      super(activity, mainComponentName);
    }

    @Override
    protected ReactRootView createRootView() {
      ReactRootView reactRootView = new ReactRootView(getContext());
      // If you opted-in for the New Architecture, we enable the Fabric Renderer.
      reactRootView.setIsFabric(BuildConfig.IS_NEW_ARCHITECTURE_ENABLED);
      return reactRootView;
    }

    @Override
    protected boolean isConcurrentRootEnabled() {
      // If you opted-in for the New Architecture, we enable Concurrent Root (i.e. React 18).
      // More on this on https://reactjs.org/blog/2022/03/29/react-v18.html
      return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
    }
  }
}
