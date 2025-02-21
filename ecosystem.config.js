module.exports = {
  apps : [{
    script: 'npm start',
  }],

  deploy : {
    production : {
      user : 'ubuntu',
      host : 'appeyetatechmobile.com',
      ref  : 'origin/main',
      repo : 'github.com/samuelabebayehu/yom-kitchen-frontend2.git',
      path : '/root/yom/yom-kitchen-frontend2',
      'pre-deploy-local': '',
      'post-deploy' : 'source ~/.nvm/nvm.sh && npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
