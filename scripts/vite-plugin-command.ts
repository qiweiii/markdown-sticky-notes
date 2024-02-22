// a vite plugin that exec a command
import { exec } from "child_process";

export default function executeCommands(commands: string | string[]) {
  return {
    name: "execute-commands",
    buildStart() {
      if (typeof commands === "string") {
        exec(commands, (error, stdout, stderr) => {
          if (error) {
            console.error(`\nexec error: ${error}`);
            return;
          }
          if (stdout) console.log(`\nexec stdout: ${stdout}`);
        });
      } else if (Array.isArray(commands)) {
        commands.forEach((command) => {
          exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`\nexec error: ${error}`);
              return;
            }
            if (stdout) console.log(`\nexec stdout: ${stdout}`);
          });
        });
      }
    },
  };
}
