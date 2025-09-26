import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from '@/context/AuthContext';

function withPermission(WrappedComponent, requiredPermissions = []) {
    return function ProtectedPage(props) {
        const { user, permissions, loading } = useContext(AuthContext);
        const router = useRouter();

        useEffect(() => {
            // If still loading user data from localStorage or wherever, do nothing yet.
            if (loading) {
                return;
            }

            // If the user is null and we are done loading, they aren’t logged in -> go to login
            if (!user) {
                router.push('/login');
                return;
            }


            // Check all the required permissions once we have them
            const hasAllPermissions = requiredPermissions.every(perm =>
                permissions.includes(perm)
            );

            if (!hasAllPermissions) {
                router.push('/not-authorized');
            }
        }, [user, permissions, router, loading]);

        // Optionally, show a loading indicator or null while loading
        if (loading) {
            return null; // or a spinner
        }

        // Otherwise, render the wrapped component
        return <WrappedComponent {...props} />;
    };
}

export default withPermission;
