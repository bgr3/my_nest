
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/": {
        "get": {
          "operationId": "AppController_getHello",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/auth/login": {
        "post": {
          "operationId": "AuthController_loginUser",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/auth/password-recovery": {
        "post": {
          "operationId": "AuthController_passwordRecovery",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthPasswordRecoveryDTO"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/new-password": {
        "post": {
          "operationId": "AuthController_newPassword",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthNewPasswordDTO"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/refresh-token": {
        "post": {
          "operationId": "AuthController_refreshToken",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/me": {
        "get": {
          "operationId": "AuthController_aboutMe",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/auth/registration": {
        "post": {
          "operationId": "AuthController_registration",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthRegistrationDTO"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/registration-confirmation": {
        "post": {
          "operationId": "AuthController_registrationConfirmation",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthRegistrationConfirmationDTO"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/auth/registration-email-resending": {
        "post": {
          "operationId": "AuthController_emailResending",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AuthEmailResendingDTO"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/blogs": {
        "post": {
          "operationId": "BlogsController_createBlog",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BlogPostType"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          }
        },
        "get": {
          "operationId": "BlogsController_getBlogs",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/blogs/{id}/posts": {
        "post": {
          "operationId": "BlogsController_createPostforBlog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostForBlogPostType"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          }
        },
        "get": {
          "operationId": "BlogsController_getPostsforBlog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/blogs/{id}": {
        "get": {
          "operationId": "BlogsController_getBlog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          }
        },
        "put": {
          "operationId": "BlogsController_updateBlog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/BlogPutType"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        },
        "delete": {
          "operationId": "BlogsController_deleteBlog",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/posts/{id}/like-status": {
        "put": {
          "operationId": "PostsController_likeStatus",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LikeStatus"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/posts": {
        "post": {
          "operationId": "PostsController_createPost",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostPostType"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          }
        },
        "get": {
          "operationId": "PostsController_getPosts",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/posts/{postId}/comments": {
        "post": {
          "operationId": "PostsController_createCommentForPost",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentPostType"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          }
        },
        "get": {
          "operationId": "PostsController_getCommentsForPost",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/posts/{postId}": {
        "get": {
          "operationId": "PostsController_getPost",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          }
        },
        "put": {
          "operationId": "PostsController_updatePost",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/PostPutType"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        },
        "delete": {
          "operationId": "PostsController_deletePost",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/users": {
        "post": {
          "operationId": "UsersController_createUser",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UserPost"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          }
        },
        "get": {
          "operationId": "UsersController_getUsers",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      },
      "/users/{id}": {
        "delete": {
          "operationId": "UsersController_deleteUser",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/comments/{commentId}/like-status": {
        "put": {
          "operationId": "CommentsController_likeStatus",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LikeStatus"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/comments/{commentId}": {
        "get": {
          "operationId": "CommentsController_getComment",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          }
        },
        "put": {
          "operationId": "CommentsController_updateComment",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CommentPutType"
                }
              }
            }
          },
          "responses": {
            "204": {
              "description": ""
            }
          }
        },
        "delete": {
          "operationId": "CommentsController_deleteComment",
          "parameters": [
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/testing/all-data": {
        "delete": {
          "operationId": "TestingController_allData",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/security/devices": {
        "get": {
          "operationId": "SecurityController_getDevices",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        },
        "delete": {
          "operationId": "SecurityController_deleteDevices",
          "parameters": [],
          "responses": {
            "204": {
              "description": ""
            }
          }
        }
      },
      "/security/devices/{deviceId}": {
        "delete": {
          "operationId": "SecurityController_deleteDevice",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          }
        }
      }
    },
    "info": {
      "title": "products example",
      "description": "The products API description",
      "version": "1.0",
      "contact": {}
    },
    "tags": [
      {
        "name": "products",
        "description": ""
      }
    ],
    "servers": [],
    "components": {
      "schemas": {
        "AuthPasswordRecoveryDTO": {
          "type": "object",
          "properties": {}
        },
        "AuthNewPasswordDTO": {
          "type": "object",
          "properties": {}
        },
        "AuthRegistrationDTO": {
          "type": "object",
          "properties": {}
        },
        "AuthRegistrationConfirmationDTO": {
          "type": "object",
          "properties": {}
        },
        "AuthEmailResendingDTO": {
          "type": "object",
          "properties": {}
        },
        "BlogPostType": {
          "type": "object",
          "properties": {}
        },
        "PostForBlogPostType": {
          "type": "object",
          "properties": {}
        },
        "BlogPutType": {
          "type": "object",
          "properties": {}
        },
        "LikeStatus": {
          "type": "object",
          "properties": {}
        },
        "PostPostType": {
          "type": "object",
          "properties": {}
        },
        "CommentPostType": {
          "type": "object",
          "properties": {}
        },
        "PostPutType": {
          "type": "object",
          "properties": {}
        },
        "UserPost": {
          "type": "object",
          "properties": {}
        },
        "CommentPutType": {
          "type": "object",
          "properties": {}
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
