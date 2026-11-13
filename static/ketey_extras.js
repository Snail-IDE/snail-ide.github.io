class SnailExtras {
    getInfo() {
      return {
        id: 'snailextras',
        name: 'Snail Extras',
        blocks: [
          {
            opcode: 'wait',
            text: 'wait [TIME] miliseconds',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              TIME: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1000
              }
            }
          },
          {
            opcode: 'waitDivide',
            text: 'wait [TIME] seconds divided by [FUNNY]',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              TIME: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              },
              FUNNY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 2
              }
            }
          },
          {
            opcode: 'fetch',
            text: 'grab [URL]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://extensions.turbowarp.org/hello.txt'
              }
            }
          }
        ]
      };
    }
  
    wait (args) {
      return new Promise((resolve, reject) => {
        const timeInMilliseconds = args.TIME * 1;
        setTimeout(() => {
          resolve();
        }, timeInMilliseconds);
      });
    }
    waitDivide (args) {
        return new Promise((resolve, reject) => {
          const timeInMilliseconds = args.TIME * 1000 / args.FUNNY;
          setTimeout(() => {
            resolve();
          }, timeInMilliseconds);
        });
      }
  
    fetch (args) {
      return fetch(args.URL)
        .then((response) => {
          return response.text();
        })
        .catch((error) => {
          console.error(error);
          return 'Uh oh! Something went wrong. Contact and screenshot this to Keyethewizard44 on Scratch.';
        });
    }
    
  }
  Scratch.extensions.register(new KeteyExtras());
