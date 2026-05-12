# Assignment 5: Angular Authentication & GCP Deployment

This guide outlines the simplest way to recreate the Angular registration, login, and profile assignment from scratch in an exam environment.

## Part 1: Project Setup

1. **Install Angular CLI globally** (if not already installed on the machine):
   ```bash
   npm install -g @angular/cli
   ```

2. **Create the Angular Application:**
   Keep it simple. Answer "Yes" to routing when prompted (or use the flag below).
   ```bash
   ng new auth-app --routing=true --style=css
   cd auth-app
   ```

3. **Generate Components:**
   Create the three components requested in the problem statement.
   ```bash
   ng generate component register
   ng generate component login
   ng generate component profile
   ```

## Part 2: Implementation Strategy (Exam-Friendly)

To keep the code minimal and executable without needing to set up a separate complex backend during the exam, you can use Angular Forms and browser `localStorage` to simulate authentication.

1. **Routing Setup (`app.routes.ts` or `app-routing.module.ts`):**
   Link your components to URL paths (`/register`, `/login`, `/profile`).

2. **Register Component (`register.component.ts/html`):**
   * **HTML:** Create a simple form with Email and Password inputs.
   * **TS:** On submit, save the user object to `localStorage.setItem('user', JSON.stringify(data))`.

3. **Login Component (`login.component.ts/html`):**
   * **HTML:** Create Email and Password inputs.
   * **TS:** On submit, read `localStorage`. If the entered credentials match the saved data, navigate to the profile page using Angular's `Router` (`this.router.navigate(['/profile'])`).

4. **Profile Component (`profile.component.ts/html`):**
   * **TS:** In the `ngOnInit` hook, read the logged-in user's data from `localStorage.getItem('user')` and save it to a component variable.
   * **HTML:** Display the user's data using Angular interpolation (e.g., `Welcome, {{ user.email }}`).

## Part 3: Deployment to Google Cloud Platform (GCP)

The problem requires deploying the script on a Google Cloud Environment. Using **Google App Engine** is the most straightforward approach for this.

1. **Build the Production Application:**
   Compile your Angular app into static files.
   ```bash
   ng build
   ```
   *This creates a `dist/` folder (e.g., `dist/auth-app/browser/`) containing your ready-to-deploy app.*

2. **Create an `app.yaml` File:**
   In the root folder of your project (where `package.json` is), create a file named `app.yaml`. This tells GCP how to serve your static files.
   ```yaml
   runtime: nodejs20
   handlers:
     # Serve all static files (js, css, images) directly
     - url: /(.*\..+)$
       static_files: dist/auth-app/browser/\1
       upload: dist/auth-app/browser/(.*\..+)$
     # Catch-all rule to serve index.html for Angular routing
     - url: /.*
       static_files: dist/auth-app/browser/index.html
       upload: dist/auth-app/browser/index.html
   ```
   *(Note: Adjust the `dist/auth-app/browser/` path slightly if your Angular version outputs the build differently).*

3. **Deploy using Google Cloud SDK:**
   Open your terminal, ensure you are logged into your GCP account, and run:
   ```bash
   # Login if you haven't already
   gcloud auth login
   
   # Set your target project ID
   gcloud config set project <YOUR_GCP_PROJECT_ID>
   
   # Deploy the application
   gcloud app deploy
   ```

4. **View your App:**
   Once deployed, GCP will provide a live URL, or you can open it directly from the CLI:
   ```bash
   gcloud app browse
   ```
