# Deployment Guide

This document describes the steps required to deploy the application to
the production server.

## 1. Connect to the Server

Access the server via SSH using the assigned private key and
credentials:

    ssh -i <your-key.pem> user@172.96.136.13

## 2. Deploy Backend (Laravel)

Once inside the server, navigate to the backend directory:

    cd /laravel/backend-laravel

Pull the latest changes from the repository:

    git pull

Make sure the pulled changes include everything you intend to deploy.

## 3. Deploy Frontend (Vite)

On your local machine, build the Vite project:

    npm run build

After compilation is complete, take the generated build files and upload
them to the server. Place the files inside the following directory:

    Main Domain /public_html

This folder serves the frontend in production.
