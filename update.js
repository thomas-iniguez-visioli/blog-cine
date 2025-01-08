const fs = require('fs');
const simpleGit = require('simple-git');
const { exec } = require('child_process');

// Lire les configurations de référentiels depuis le fichier JSON
const repositories = JSON.parse(fs.readFileSync('repositories.json', 'utf-8'));

async function pullCommitAndPushIfNeeded() {
  try {
    for (const repoConfig of repositories) {
      if(!fs.existsSync(repoConfig.path)){
        break
      }
      const git = simpleGit(repoConfig.path);

      // Effectuer git fetch pour obtenir les dernières informations du référentiel distant
      await git.fetch(repoConfig.remote);

      // Vérifier s'il y a des fichiers non commités
      const status = await git.status();
      if (status.files.length > 0) {
        console.log(`Pour ${repoConfig.path}: Des fichiers non commités ont été détectés.`);

        // Ajouter tous les fichiers et effectuer un commit
        await git.add('.');
        await git.commit('Auto-commit : changements locaux');

        console.log(`Pour ${repoConfig.path}: Changements locaux commités.`);
      }

      // Vérifier si les commits locaux et distants sont différents
      const localCommit = await git.revparse(['HEAD']);
      const remoteCommit = await git.revparse([`remotes/${repoConfig.remote}/${repoConfig.branch||"main"}`]);

      if (localCommit !== remoteCommit) {
        // Effectuer git pull
        await git.pull(repoConfig.remote, repoConfig.branch||"main", { '--rebase': 'true' });
        console.log(`Pour ${repoConfig.path}: Pull terminé avec succès.`);

        // Effectuer git push pour envoyer les changements locaux
        await git.push(repoConfig.remote,repoConfig.branch||"main",);
        console.log(`Pour ${repoConfig.path}: Push terminé avec succès.`);
      } else {
        console.log(`Pour ${repoConfig.path}: Aucun commit à récupérer.`);
      }

      // Exécuter la commande CMD après le pull/push si spécifié
      if (repoConfig.cmdAfterPull) {
        console.log(`Pour ${repoConfig.path}: Exécution de la commande CMD.`);
        exec(repoConfig.cmdAfterPull, (error, stdout, stderr) => {
          if (error) {
            console.error(`Erreur lors de l'exécution de la commande : ${error}`);
            return;
          }
          console.log(`Sortie de la commande : ${stdout}`);
          console.error(`Erreur de la commande : ${stderr}`);
        });
      }
    }
  } catch (error) {
    console.error('Erreur :', error);
  }
}
pullCommitAndPushIfNeeded()
// Planification de l'exécution toutes les 30 secondes
setInterval(pullCommitAndPushIfNeeded, 30000);
