package com.donnfelker.android.bootstrap;
import com.hacknyu.brill.darrengeng.AndroidModule;
import com.hacknyu.brill.darrengeng.BootstrapModule;

final class Modules {
    static Object[] list() {
        return new Object[] {
                new AndroidModule(),
                new BootstrapModule()
        };
    }

    private Modules() {
        // No instances.
    }
}
