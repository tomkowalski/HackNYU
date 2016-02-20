package com.hacknyu.brill.darrengeng;

import android.accounts.AccountsException;
import android.app.Activity;

import com.hacknyu.brill.darrengeng.core.BootstrapService;

import java.io.IOException;

public interface BootstrapServiceProvider {
    BootstrapService getService(Activity activity) throws IOException, AccountsException;
}
