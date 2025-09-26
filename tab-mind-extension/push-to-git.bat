@echo off
echo 🚀 Tab Mind Extension - Git Push Script
echo =====================================

:: Check if git is installed
git --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git is not installed or not in PATH
    echo Please install Git from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git is installed

:: Check if we're in a git repository
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
    if %errorlevel% neq 0 (
        echo ❌ Failed to initialize Git repository
        pause
        exit /b 1
    )
)

:: Check if user has configured Git
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Git user not configured
    set /p username="Enter your Git username: "
    set /p email="Enter your Git email: "
    git config --global user.name "%username%"
    git config --global user.email "%email%"
    echo ✅ Git user configured
)

:: Add all files
echo 📦 Adding files to Git...
git add .
if %errorlevel% neq 0 (
    echo ❌ Failed to add files
    pause
    exit /b 1
)

:: Commit changes
echo 💾 Committing changes...
git commit -m "Add Tab Mind Chrome Extension with AI categorization and custom thumbnails"
if %errorlevel% neq 0 (
    echo ⚠️  Nothing to commit or commit failed
)

:: Check if remote origin exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo 🔗 No remote repository configured
    echo Please create a repository on GitHub first, then run:
    echo git remote add origin https://github.com/YOUR_USERNAME/tab-mind-extension.git
    echo git push -u origin main
    pause
    exit /b 1
) else (
    echo 🚀 Pushing to remote repository...
    git push
    if %errorlevel% equ 0 (
        echo ✅ Successfully pushed to repository!
        echo 🌐 Your extension is now online!
    ) else (
        echo ❌ Push failed. You may need to pull first or check credentials
        echo Try: git pull origin main
    )
)

echo.
echo 🎉 Done! Check your GitHub repository
pause