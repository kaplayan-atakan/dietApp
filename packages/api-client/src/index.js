"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultConfig = exports.createApiClient = exports.ApiClient = void 0;
var axios_1 = require("axios");
var ApiClient = /** @class */ (function () {
    function ApiClient(config) {
        this.client = axios_1.default.create({
            baseURL: config.baseURL,
            timeout: config.timeout || 30000,
            headers: __assign({ 'Content-Type': 'application/json' }, config.headers),
        });
        this.setupInterceptors();
    }
    ApiClient.prototype.setupInterceptors = function () {
        var _this = this;
        // Request interceptor
        this.client.interceptors.request.use(function (config) {
            if (_this.authToken) {
                config.headers.Authorization = "Bearer ".concat(_this.authToken);
            }
            return config;
        }, function (error) { return Promise.reject(error); });
        // Response interceptor
        this.client.interceptors.response.use(function (response) { return response; }, function (error) {
            var _a;
            if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                _this.clearAuth();
            }
            return Promise.reject(error);
        });
    };
    ApiClient.prototype.setAuthToken = function (token) {
        this.authToken = token;
    };
    ApiClient.prototype.clearAuth = function () {
        this.authToken = undefined;
    };
    ApiClient.prototype.request = function (config) {
        return __awaiter(this, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.request(config)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data.data];
                    case 2:
                        error_1 = _a.sent();
                        throw this.handleError(error_1);
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    ApiClient.prototype.handleError = function (error) {
        var _a;
        if ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) {
            return new Error(error.response.data.message || 'API Error');
        }
        return error;
    };
    // Authentication endpoints
    ApiClient.prototype.login = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/auth/login',
                        data: { email: email, password: password },
                    })];
            });
        });
    };
    ApiClient.prototype.register = function (userData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/auth/register',
                        data: userData,
                    })];
            });
        });
    };
    ApiClient.prototype.refreshToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/auth/refresh',
                    })];
            });
        });
    };
    // Onboarding endpoints
    ApiClient.prototype.saveBasicInfo = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/onboarding/basic-info',
                        data: data,
                    })];
            });
        });
    };
    ApiClient.prototype.saveEatingHabits = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/onboarding/eating-habits',
                        data: data,
                    })];
            });
        });
    };
    ApiClient.prototype.saveActivityLevel = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/onboarding/activity-level',
                        data: data,
                    })];
            });
        });
    };
    ApiClient.prototype.saveGoals = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/onboarding/goals',
                        data: data,
                    })];
            });
        });
    };
    ApiClient.prototype.generatePlan = function (userId, deviceToken) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/onboarding/generate-plan',
                        data: { userId: userId, deviceToken: deviceToken },
                    })];
            });
        });
    };
    // User endpoints
    ApiClient.prototype.getProfile = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'GET',
                        url: '/users/profile',
                    })];
            });
        });
    };
    ApiClient.prototype.updateProfile = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'PUT',
                        url: '/users/profile',
                        data: data,
                    })];
            });
        });
    };
    // Dashboard endpoints
    ApiClient.prototype.getDashboardData = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'GET',
                        url: '/dashboard',
                    })];
            });
        });
    };
    // Nutrition endpoints
    ApiClient.prototype.getNutritionPlan = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'GET',
                        url: '/nutrition/plan',
                        params: { date: date },
                    })];
            });
        });
    };
    ApiClient.prototype.getNutritionHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'GET',
                        url: '/nutrition/history',
                    })];
            });
        });
    };
    // Workout endpoints
    ApiClient.prototype.getWorkoutPlan = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'GET',
                        url: '/workouts/plan',
                        params: { date: date },
                    })];
            });
        });
    };
    ApiClient.prototype.getWorkoutHistory = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'GET',
                        url: '/workouts/history',
                    })];
            });
        });
    };
    // Tracking endpoints
    ApiClient.prototype.trackFood = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/tracking/food',
                        data: data,
                    })];
            });
        });
    };
    ApiClient.prototype.getFoodTracking = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'GET',
                        url: '/tracking/food',
                        params: { date: date },
                    })];
            });
        });
    };
    ApiClient.prototype.trackWorkout = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/tracking/workout',
                        data: data,
                    })];
            });
        });
    };
    ApiClient.prototype.getWorkoutTracking = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'GET',
                        url: '/tracking/workout',
                        params: { date: date },
                    })];
            });
        });
    };
    // AI Recommendations
    ApiClient.prototype.getRecommendations = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'GET',
                        url: '/ai/recommendations',
                    })];
            });
        });
    };
    ApiClient.prototype.markRecommendationAsRead = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'PUT',
                        url: "/ai/recommendations/".concat(id, "/read"),
                    })];
            });
        });
    };
    // Notification endpoints
    ApiClient.prototype.registerNotificationToken = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/notifications/register-token',
                        data: data,
                    })];
            });
        });
    };
    ApiClient.prototype.sendNotification = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/notifications/send',
                        data: data,
                    })];
            });
        });
    };
    ApiClient.prototype.sendBulkNotifications = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'POST',
                        url: '/notifications/send-bulk',
                        data: data,
                    })];
            });
        });
    };
    ApiClient.prototype.getNotificationTokens = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.request({
                        method: 'GET',
                        url: '/notifications/tokens',
                    })];
            });
        });
    };
    return ApiClient;
}());
exports.ApiClient = ApiClient;
// Create a default instance
var createApiClient = function (config) { return new ApiClient(config); };
exports.createApiClient = createApiClient;
// Export default configuration helper
var getDefaultConfig = function () { return ({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    timeout: 30000,
}); };
exports.getDefaultConfig = getDefaultConfig;
exports.default = ApiClient;
