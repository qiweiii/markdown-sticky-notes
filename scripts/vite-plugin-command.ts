// a vite plugin that exec a command
import { exec } from "child_process";

export default function executeCommand(command: string) {
  return {
    name: "execute-command",
    buildStart() {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        if (stdout) console.log(`stdout: ${stdout}`);
      });
    },
  };
}
