package com.com.donnfelker.android.bootstrap;

import com.hacknyu.brill.darrengeng.authenticator.BootstrapAuthenticatorActivity;
import com.hacknyu.brill.darrengeng.core.TimerService;
import com.hacknyu.brill.darrengeng.ui.BootstrapActivity;
import com.hacknyu.brill.darrengeng.ui.BootstrapFragmentActivity;
import com.hacknyu.brill.darrengeng.ui.BootstrapTimerActivity;
import com.hacknyu.brill.darrengeng.ui.CheckInsListFragment;
import com.hacknyu.brill.darrengeng.ui.MainActivity;
import com.hacknyu.brill.darrengeng.ui.NavigationDrawerFragment;
import com.hacknyu.brill.darrengeng.ui.NewsActivity;
import com.hacknyu.brill.darrengeng.ui.NewsListFragment;
import com.hacknyu.brill.darrengeng.ui.UserActivity;
import com.hacknyu.brill.darrengeng.ui.UserListFragment;

import javax.inject.Singleton;

import dagger.Component;

@Singleton
@Component(
        modules = {
                AndroidModule.class,
                BootstrapModule.class
        }
)
public interface BootstrapComponent {

    void inject(BootstrapApplication target);

    void inject(BootstrapAuthenticatorActivity target);

    void inject(BootstrapTimerActivity target);

    void inject(MainActivity target);

    void inject(CheckInsListFragment target);

    void inject(NavigationDrawerFragment target);

    void inject(NewsActivity target);

    void inject(NewsListFragment target);

    void inject(UserActivity target);

    void inject(UserListFragment target);

    void inject(TimerService target);

    void inject(BootstrapFragmentActivity target);
    void inject(BootstrapActivity target);


}
