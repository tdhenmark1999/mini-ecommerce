function useAuth() {
    const token = localStorage.getItem('token');
    return !!token;  // returns true if token exists, false otherwise
}
export default useAuth;
