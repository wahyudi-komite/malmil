import { Injectable } from '@angular/core';
import { FuseMockApiService } from '@fuse/lib/mock-api';
import { user as userData } from 'app/mock-api/common/user/data';
import Base64 from 'crypto-js/enc-base64';
import Utf8 from 'crypto-js/enc-utf8';
import HmacSHA256 from 'crypto-js/hmac-sha256';
import { cloneDeep } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class AuthMockApi {
    private readonly _secret: any;
    private _user: any = userData;
    private _authenticated: boolean = false;
    private _currentUser: any = null;

    /**
     * Constructor
     */
    constructor(private _fuseMockApiService: FuseMockApiService) {
        // Set the mock-api
        this._secret =
            'YOUR_VERY_CONFIDENTIAL_SECRET_FOR_SIGNING_JWT_TOKENS!!!';

        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Forgot password - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/v1/auth/forgot-password', 1000)
            .reply(() => [200, true]);

        // -----------------------------------------------------------------------------------------------------
        // @ Reset password - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/v1/auth/reset-password', 1000)
            .reply(() => [200, true]);

        // -----------------------------------------------------------------------------------------------------
        // @ Sign in - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/v1/auth/sign-in', 1500)
            .reply(({ request }) => {
                let user: any;

                // Sign in successful
                if (
                    request.body.email === 'hughes.brian@company.com' &&
                    request.body.password === 'admin'
                ) {
                    user = cloneDeep(this._user);
                }

                // Quick login - Administrator
                if (
                    request.body.email === 'adhye.yudhie@gmail.com' &&
                    request.body.password === 'Astra123#'
                ) {
                    user = cloneDeep(this._user);
                    user.role = { name: 'super_admin' };
                }

                // Quick login - Operator
                if (
                    request.body.email === 'operator@example.com' &&
                    request.body.password === 'Astra123#'
                ) {
                    user = cloneDeep(this._user);
                    user.role = { name: 'operator' };
                }

                if (!user) {
                    return [401, { error: 'Invalid credentials' }];
                }

                this._authenticated = true;
                this._currentUser = cloneDeep(user);
                return [
                    200,
                    {
                        user,
                        accessToken: this._generateJWTToken(),
                        tokenType: 'bearer',
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Sign in using the access token - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/v1/auth/sign-in-with-token')
            .reply(({ request }) => {
                // Get the access token
                const accessToken = request.body.accessToken;

                // Verify the token
                if (this._verifyJWTToken(accessToken)) {
                    return [
                        200,
                        {
                            user: cloneDeep(this._user),
                            accessToken: this._generateJWTToken(),
                            tokenType: 'bearer',
                        },
                    ];
                }

                // Invalid token
                return [
                    401,
                    {
                        error: 'Invalid token',
                    },
                ];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Sign up - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService.onPost('api/v1/auth/sign-up', 1500).reply(() =>
            // Simply return true
            [200, true]
        );

        // -----------------------------------------------------------------------------------------------------
        // @ Unlock session - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/v1/auth/unlock-session', 1500)
            .reply(({ request }) => {
                // Sign in successful
                if (
                    request.body.email === 'hughes.brian@company.com' &&
                    request.body.password === 'admin'
                ) {
                    return [
                        200,
                        {
                            user: cloneDeep(this._user),
                            accessToken: this._generateJWTToken(),
                            tokenType: 'bearer',
                        },
                    ];
                }

                // Invalid credentials
                return [404, false];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Check auth - GET
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onGet('api/v1/auth/check-auth')
            .reply(() => {
                if (this._authenticated && this._currentUser) {
                    return [
                        200,
                        { isAuthenticated: true, user: cloneDeep(this._currentUser) },
                    ];
                }
                return [200, { isAuthenticated: false }];
            });

        // -----------------------------------------------------------------------------------------------------
        // @ Refresh token - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/v1/auth/refresh')
            .reply(() => [200, { accessToken: this._generateJWTToken() }]);

        // -----------------------------------------------------------------------------------------------------
        // @ Logout - POST
        // -----------------------------------------------------------------------------------------------------
        this._fuseMockApiService
            .onPost('api/v1/auth/logout')
            .reply(() => {
                this._authenticated = false;
                this._currentUser = null;
                return [200, true];
            });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Return base64 encoded version of the given string
     *
     * @param source
     * @private
     */
    private _base64url(source: any): string {
        // Encode in classical base64
        let encodedSource = Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        // Return the base64 encoded string
        return encodedSource;
    }

    /**
     * Generates a JWT token using CryptoJS library.
     *
     * This generator is for mocking purposes only and it is NOT
     * safe to use it in production frontend applications!
     *
     * @private
     */
    private _generateJWTToken(): string {
        // Define token header
        const header = {
            alg: 'HS256',
            typ: 'JWT',
        };

        // Calculate the issued at and expiration dates
        const date = new Date();
        const iat = Math.floor(date.getTime() / 1000);
        const exp = Math.floor(date.setDate(date.getDate() + 7) / 1000);

        // Define token payload
        const payload = {
            iat: iat,
            iss: 'Fuse',
            exp: exp,
        };

        // Stringify and encode the header
        const stringifiedHeader = Utf8.parse(JSON.stringify(header));
        const encodedHeader = this._base64url(stringifiedHeader);

        // Stringify and encode the payload
        const stringifiedPayload = Utf8.parse(JSON.stringify(payload));
        const encodedPayload = this._base64url(stringifiedPayload);

        // Sign the encoded header and mock-api
        let signature: any = encodedHeader + '.' + encodedPayload;
        signature = HmacSHA256(signature, this._secret);
        signature = this._base64url(signature);

        // Build and return the token
        return encodedHeader + '.' + encodedPayload + '.' + signature;
    }

    /**
     * Verify the given token
     *
     * @param token
     * @private
     */
    private _verifyJWTToken(token: string): boolean {
        // Split the token into parts
        const parts = token.split('.');
        const header = parts[0];
        const payload = parts[1];
        const signature = parts[2];

        // Re-sign and encode the header and payload using the secret
        const signatureCheck = this._base64url(
            HmacSHA256(header + '.' + payload, this._secret)
        );

        // Verify that the resulting signature is valid
        return signature === signatureCheck;
    }
}
