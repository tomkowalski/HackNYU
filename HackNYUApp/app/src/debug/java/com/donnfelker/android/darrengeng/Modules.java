package com.hacknyu.brill.darrengeng;


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
