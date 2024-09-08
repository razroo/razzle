import { parseEJSCode, replaceCurlyBrace, replaceTagParameters } from './replace';

describe('replace', () => {
  describe('replaceTagParameters', () => {
    it('should replace tag parameters', () => {
      const mockParameters = {
        name: 'test',
        selector: 'test-two',
        className: ''
      };
      const mockString = `hello <%= name %>`;
      const result = replaceTagParameters(mockParameters, mockString);
      expect(result).toEqual('hello test');
    });
  });
  describe('replaceCurlyBrace', () => {
    it('should replaceCurlyBrace with respective parameters', () => {
      const mockParameters = {
        name: 'test',
        selector: 'test-two',
        className: ''
      };
      const mockFileStringWithCurlyBrace = 'src/{selector}/{name}.component.html';
  
      const result = replaceCurlyBrace(mockParameters, mockFileStringWithCurlyBrace);
      const expected = 'src/test-two/test.component.html';
  
      expect(result).toEqual(expected);
    });
  
    it('should replace with curly braces if curly brace values shows up more than once and replace value with kebab case', () => {
      const mockParameters = {
        nameFilePath:"libs/common/ui/src/lib/{name}-dialog",
        name:"Hello World"
      };
      const mockFileStringWithCurlyBrace = '{nameFilePath}/{name}-dialog.component.ts';
  
      const result = replaceCurlyBrace(mockParameters, mockFileStringWithCurlyBrace, true);
      const expected = 'libs/common/ui/src/lib/hello-world-dialog/hello-world-dialog.component.ts';
  
      expect(result).toEqual(expected);
    });

    it('should replace with curly braces if curly brace values shows up more than once and replace value with kebab case test two', () => {
      const mockParameters = {
        className: 'Blue',
        constantName: 'BLUE',
        fileName: 'blue',
        name: 'blue',
        nameFilePath: 'libs/data-models/src/lib/{name}',
        propertyName: 'blue', 
        selector: 'razroo-angular-starter',
        titleName: 'Blue'
      };
      const mockFileStringWithCurlyBrace = '{nameFilePath}/{name}.mock.ts';
  
      const result = replaceCurlyBrace(mockParameters, mockFileStringWithCurlyBrace, true);
      const expected = 'libs/data-models/src/lib/blue/blue.mock.ts';
  
      expect(result).toEqual(expected);
    });

    it('should replace curly brace placeholders with values from mockParameters object even if one is null', () => {
      const mockParameters = {
        param1: 'value1',
        param2: 123, // non-string value
        param3: null, // non-string value
        param4: 'value4/with/slashes' // should be kebab-cased
      } as any;
      const mockFileStringWithCurlyBrace = 'This is a {param1} and {param2} and {param3} and {param4}';
      const expectedResult = 'This is a value-1 and 123 and null and value4/with/slashes';
      const result = replaceCurlyBrace(mockParameters, mockFileStringWithCurlyBrace, true);
      expect(result).toEqual(expectedResult);
    });

    it('should remove beginning forward slash if null value', () => {
      const mockParameters = { 
        name: 'blue',
        nameFilePath: '',
      }
      const mockFileStringWithCurlyBrace = '{nameFilePath}/{name}.mock.ts';
      const result = replaceCurlyBrace(mockParameters, mockFileStringWithCurlyBrace, true);
      const expected = 'blue.mock.ts';
      expect(result).toEqual(expected);
    });

  });

  describe('parseEJSCode', () => {
    it('should replace tag parameters', () => {
      const mockParameters = {
        name: 'test',
        selector: 'test-two',
        className: ''
      };
      const mockString = `hello <%= name %>`;
      const result = parseEJSCode(mockParameters, mockString);
      expect(result).toEqual('hello test');
    });
    it('parseEJSCode should parse for loop correctly', () => {
      const mockParameters = {
        colors: ['blue', 'green', 'red', 'yellow'],
      };
      const mockFileString = "import x from 'y';\nclass DynamicClass = {\n<% for(let i=0; i<colors.length; i++) { %>\n<%= colors[i] %>: string;\n<% } %>\n}";
  
      const result = parseEJSCode(mockParameters as any, mockFileString);
      const expected = "import x from 'y';\nclass DynamicClass = {\n\nblue: string;\n\ngreen: string;\n\nred: string;\n\nyellow: string;\n\n}";
      expect(result).toEqual(expected);
    });

    it('parseEJSCode should parse object loop correctly', () => {
      const mockParameters = {
        "nameSchema":{"Stepper":{"title":"String","id":"ID","count":"Int","recipeId":"String"}}
      }
      const mockFileString = `<% const schema = Object.values(nameSchema)[0] %>
        export interface <%= Object.keys(nameSchema)[0] %> {<% for (const prop in schema) { %>
          <%= prop %>: <%= schema[prop] %>;<% } %>
        }
      `;
  
      const result = parseEJSCode(mockParameters as any, mockFileString);
      const expected = `
        export interface Stepper {
          title: String;
          id: ID;
          count: Int;
          recipeId: String;
        }
      `;
      expect(result).toEqual(expected);
    });
  });
});
