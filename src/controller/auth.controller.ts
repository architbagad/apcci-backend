class Auth {
    private static instance: Auth;

    public static getInstance(): Auth {
        if (!Auth.instance) {
            Auth.instance = new Auth();
        }
        return Auth.instance;
    }
    
    constructor() {}

    public async login(username: string, password: string): Promise<any> {

    }

    public async logout(token: string): Promise<void> {
    
    }

    public async register(username: string, password: string): Promise<any> {
    }

    public async profile(): Promise<any> {
    }
}