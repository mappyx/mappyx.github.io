---
title: Building Modern APIs with MicroJet
date: 2026-01-17
description: Learn how to build fast, secure, and modular APIs using the MicroJet framework and PHP 8.
---

# Building Modern APIs with MicroJet

If you're tired of bulky frameworks that feel like "bloatware," you need to check out **MicroJet**. It's a high-performance PHP framework designed to combine the simplicity of a micro-framework with the robust features required for enterprise applications.

In this guide, we'll cover how to install MicroJet and set up your first API endpoints using its modern, attribute-driven architecture.

## Why MicroJet?

MicroJet is built for speed and developer productivity:
- **Declarative**: Use native PHP 8 attributes for routes and validation.
- **High Performance**: Optimized with a Trie-based router and JIT container.
- **Modular**: Choose the components you need (ORM, Queue, Storage).

---

## 🔧 Installation

Getting started is as simple as running a Composer command:

```bash
composer require microjet/framework
```

Once installed, you can boot up the built-in development server:

```bash
php micro serve
```

Your API is now running at `http://localhost:8000`.

---

## 🏛️ Architecture: Defining Routes

MicroJet eliminates the need for massive routing files. Instead, you define routes directly on your controller methods using the `#[Route]` attribute.

### Basic Controller Example

```php
use MicroJet\Attributes\Route;
use MicroJet\Request;
use MicroJet\Response;

class UserController {
    
    #[Route('GET', '/users/{id}')]
    public function show(Request $request): Response {
        $id = $request->param('id');
        
        // Logic to fetch user...
        return Response::json([
            'id' => $id, 
            'name' => 'Alice',
            'status' => 'active'
        ]);
    }
}
```

---

## 🛡️ Declarative Validation

Validation in MicroJet is a dream. You can validate incoming request data using the `#[Validate]` attribute. If the validation fails, MicroJet automatically returns a structured error response before the controller even executes.

```php
use MicroJet\Attributes\Validate;

#[Route('POST', '/users')]
#[Validate([
    'email' => 'required|email',
    'password' => 'required|min:8',
    'role' => 'in:admin,user'
])]
public function create(Request $request): Response {
    // If you reach this point, the data is guaranteed to be valid.
    $data = $request->body();
    
    return Response::json(['message' => 'User created successfully'], 201);
}
```

---

## 🏗️ Dependency Injection

MicroJet handles dependency resolution automatically. Simply type-hint your services in the constructor, and the container will inject them for you.

```php
public function __construct(
    protected UserService $userService,
    protected MailerInterface $mailer
) {}
```

---

## Conclusion

MicroJet offers a sleek, modern approach to PHP development. By leveraging native PHP 8 features, it keeps your code clean, readable, and incredibly fast. 

Stay tuned for future posts where we'll dive deeper into **Jet ORM** and the **MicroJet Queue System**!

Happy coding!
