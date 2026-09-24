/*
        <div className={`d-flex`}>
            <div className={`d-flex flex-row sidebar ${isOpenSideBar.isOpen ? 'open' : 'closed'}`}>
                <LeftSidebar isOpenSideBar={isOpenSideBar.isOpen} items={[{
        key: 'pages',
        label: 'Pages',
        isTitle: false,
        icon: 'uil-copy-alt',
        children: [
            {
                key: 'page-profile',
                label: 'Profile',
                url: '/pages/profile',
                parentKey: 'pages',
            },
            {
                key: 'page-profile2',
                label: 'Profile 2',
                url: '/pages/profile2',
                parentKey: 'pages',
            },
            {
                key: 'page-invoice',
                label: 'Invoice',
                url: '/pages/invoice',
                parentKey: 'pages',
            },
            {
                key: 'page-faq',
                label: 'FAQ',
                url: '/pages/faq',
                parentKey: 'pages',
            },
            {
                key: 'page-pricing',
                label: 'Pricing',
                url: '/pages/pricing',
                parentKey: 'pages',
            },
            {
                key: 'page-maintenance',
                label: 'Maintenance',
                url: '/error/maintenance',
                parentKey: 'pages',
            },
            {
                key: 'auth-pages',
                label: 'Authentication',
                parentKey: 'pages',
                children: [
                    {
                        key: 'auth-login',
                        label: 'Login',
                        url: '/account/login',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-login2',
                        label: 'Login 2',
                        url: '/account/login2',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-register',
                        label: 'Register',
                        url: '/account/register',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-register2',
                        label: 'Register 2',
                        url: '/account/register2',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-logout',
                        label: 'Logout',
                        url: '/account/logout',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-logout2',
                        label: 'Logout 2',
                        url: '/account/logout2',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-recover-password',
                        label: 'Recover Password',
                        url: '/account/recover-password',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-recover-password2',
                        label: 'Recover Password 2',
                        url: '/account/recover-password2',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-lock-screen',
                        label: 'Lock Screen',
                        url: '/account/lock-screen',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-lock-screen2',
                        label: 'Lock Screen 2',
                        url: '/account/lock-screen2',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-confirm-mail',
                        label: 'Confirm Mail',
                        url: '/account/confirm-mail',
                        parentKey: 'auth-pages',
                    },
                    {
                        key: 'auth-confirm-mail2',
                        label: 'Confirm Mail 2',
                        url: '/account/confirm-mail2',
                        parentKey: 'auth-pages',
                    },
                ],
            },
            {
                key: 'error-pages',
                label: 'Error',
                url: '/error',
                parentKey: 'pages',
                children: [
                    {
                        key: 'error-404',
                        label: 'Error - 404',
                        url: '/error/404',
                        parentKey: 'error-pages',
                    },
                    {
                        key: 'error-404-alt',
                        label: 'Error - 404-alt',
                        url: '/pages/404-alt',
                        parentKey: 'error-pages',
                    },
                    {
                        key: 'error-500',
                        label: 'Error - 500',
                        url: '/error/500',
                        parentKey: 'error-pages',
                    },
                ],
            },
            {
                key: 'page-starter',
                label: 'Starter Page',
                url: '/pages/starter',
                parentKey: 'pages',
            },
            {
                key: 'page-preloader',
                label: 'With Preloader',
                url: '/pages/preloader',
                parentKey: 'pages',
            },
            {
                key: 'page-timeline',
                label: 'Timeline',
                url: '/pages/timeline',
                parentKey: 'pages',
            },
        ],
    }, ]}/>
            </div>
            <div className={`principal-view w-100 ${isOpenSideBar.isOpen ? 'shift' : ''}`} style={{overflow: 'hidden'}}>
                <Outlet/>
            </div>
        </div>
*/