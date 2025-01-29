#!/bin/bash

# Função para exibir mensagens com cores
print_message() {
    local color=$1
    local message=$2
    case $color in
        "green") echo -e "\033[32m$message\033[0m" ;;
        "red") echo -e "\033[31m$message\033[0m" ;;
        "yellow") echo -e "\033[33m$message\033[0m" ;;
        *) echo "$message" ;;
    esac
}

# Função para verificar o resultado do último comando
check_result() {
    if [ $? -eq 0 ]; then
        print_message "green" "✓ $1"
    else
        print_message "red" "✗ $1"
        exit 1
    fi
}

# 1. Instalando dependências
print_message "yellow" "Installing dependencies..."
npm install
check_result "Dependencies installed successfully"

# 2. Rodando testes
print_message "yellow" "Running tests..."
npm test
check_result "Tests completed successfully"

# 3. Preparando para deploy (limpeza, minificação)
print_message "yellow" "Preparing for deployment..."
npm run predeploy
check_result "Code minification completed"

# 4. Fazendo deploy
print_message "yellow" "Deploying to AWS..."
npm run deploy -- --stage prod
check_result "Deployment completed successfully"

print_message "green" "✨ Service deployed successfully!"
