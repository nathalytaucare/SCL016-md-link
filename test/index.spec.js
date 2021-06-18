const {mdlinks,FileOrDirectory,validateOption,statsOption,statsValidateOption} = require('../index.js');

let dirPath ="C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta";
let dirPath1 ="C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/tes";
let options = {
  validate: false,
  stats: false
};
let options1 = {
  validate: true,
  stats: false
};
let options2 = {
  validate: false,
  stats: true
};
let options3 = {
  validate: true,
  stats: true
};

let links =[{
  href: 'https://pt.wikipedia.org/wiki/Markdown',
  text: 'Markdown',
  file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/prueba1.md'
},]
let links1 =[{
  href: 'https://pt.wikipedia.org/wiki/Markdown',
  text: 'Markdown',
  file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/pruebac2/p1.md',
  status: 200,
  response: 'O.K.'
},]

describe("mdLinks", () => {
  it("deberia ser una funcion", () => {
    expect(typeof mdlinks).toBe("function");
  })
  it("deberia retornar los links de una ruta que es un Directorio", () => {
    expect.assertions(1);
    return mdlinks(dirPath, options).then(res =>
      expect(res).toEqual(
        [
          {
            href: 'https://pt.wikipedia.org/wiki/Markdown',
            text: 'Markdown',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/prueba1.md'
          },
          {
            href: 'https://jestjs.io/docs/es-ES/gett-started',
            text: 'Fail',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/prueba1.md'
          },
          {
            href: 'https://nodejs.org/',
            text: 'Node.js',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/prueba1.md'
          },
          {
            href: 'https://pt.wikipedia.org/wiki/Markdown',
            text: 'Markdown',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/pruebac2/p1.md'
          },
          {
            href: 'https://nodejs.org/',
            text: 'Node.js',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/pruebac2/p1.md'
          }
        ]
      )
    );
  });
  it("Deberia retornar los links con validacion", () => {
    expect.assertions(1);
    return mdlinks(dirPath, options1).then(res =>
      expect(res).toEqual(
        [
          {
            href: 'https://pt.wikipedia.org/wiki/Markdown',
            text: 'Markdown',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/prueba1.md',
            status: 200,
            response: 'O.K.'
          },
          {
            href: 'https://jestjs.io/docs/es-ES/gett-started',
            text: 'Fail',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/prueba1.md',
            status: 404,
            response: 'FAIL'
          },
          {
            href: 'https://nodejs.org/',
            text: 'Node.js',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/prueba1.md',
            status: 200,
            response: 'O.K.'
          },
          {
            href: 'https://pt.wikipedia.org/wiki/Markdown',
            text: 'Markdown',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/pruebac2/p1.md',
            status: 200,
            response: 'O.K.'
          },
          {
            href: 'https://nodejs.org/',
            text: 'Node.js',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/pruebac2/p1.md',
            status: 200,
            response: 'O.K.'
          }
        ]
      )
    );
  });
  it("Deberia retornar la estadistica de links", () => {
    expect.assertions(1);
    return mdlinks(dirPath, options2).then(res =>
      expect(res).toEqual(
        { total: 5, unique: 3 }
      )
    );
  });
  it("Deberia retornar la estadistica de links y validacion", () => {
    expect.assertions(1);
    return mdlinks(dirPath, options3).then(res =>
      expect(res).toEqual(
        { total: 5, unique: 3, broken: 1 }
      )
    );
  });
  it("Deberia retornar los links dentro de un archivo .md", () => {
    expect.assertions(1);
    return FileOrDirectory(dirPath).then(res =>
      expect(res).toEqual(
        [
          {
            href: 'https://pt.wikipedia.org/wiki/Markdown',
            text: 'Markdown',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/prueba1.md'
          },
          {
            href: 'https://jestjs.io/docs/es-ES/gett-started',
            text: 'Fail',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/prueba1.md'
          },
          {
            href: 'https://nodejs.org/',
            text: 'Node.js',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/prueba1.md'
          },
          {
            href: 'https://pt.wikipedia.org/wiki/Markdown',
            text: 'Markdown',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/pruebac2/p1.md'
          },
          {
            href: 'https://nodejs.org/',
            text: 'Node.js',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/pruebac2/p1.md'
          }
        ]
      )
    );
  });
  // test('Deria retornar un error al ingresar una ruta invalida', () => {
  //   return expect(FileOrDirectory(dirPath1)).rejects.toEqual("No es una ruta valida");
  // });
  it('Error ruta ingresada no valida', () => {
    expect.assertions();
    return expect(FileOrDirectory(dirPath1)).rejects.toThrow("No es una ruta valida");
  });

  it("Deberia retornar la validacion de links", () => {
    expect.assertions(1);
    return validateOption(links).then(res =>
      expect(res).toEqual(
        [
          {
            href: 'https://pt.wikipedia.org/wiki/Markdown',
            text: 'Markdown',
            file: 'C:/Users/Nathaly/Documents/Laboratoria/SCL016-md-link/test/pruebacarpeta/prueba1.md',
            status: 200,
            response: 'O.K.'
          }
        ]
      )
    );
  });

  // it("Deberia retornar la validacion de links", () => {
  //   expect.assertions(1);
  //   return statsOption(links).then(res =>
  //     expect(res).toEqual(
  //       { total: 5, unique: 3 }
  //     )
  //   );
  // });

  // it("Deberia retornar la estaditica de los links", () => {
  //   expect.assertions();
  //   return statsValidateOption(links1).then(res =>
  //     expect(res).toEqual(
  //       { total: 1, unique: 1, broken: 0 }
  //     )
  //   );
  // });

  it('Error al ingresar en la funcion estadistica y validación', () => {
    expect.assertions();
    return expect(statsValidateOption(dirPath)).rejects.toThrow("Error en la promesa");
  });
  
})
