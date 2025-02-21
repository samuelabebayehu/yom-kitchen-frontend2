module.exports = {
  apps : [{
    name:"yom-kitchen",
    script: 'npm start',
    env: {
      "NEXT_PUBLIC_API_BASE_URL": "http://localhost:8080"
  }
  }],

  deploy : {
    production : {
      user : 'root',
      host : 'appeyetatechmobile.com',
      ref  : 'origin/main',
      repo : 'https://github.com/samuelabebayehu/yom-kitchen-frontend2.git',
      path : '/root/yom/yom-kitchen-frontend2',
      'pre-deploy-local': '',
      'post-deploy' : 'source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
