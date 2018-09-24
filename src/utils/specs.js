/**
 * List of all specs supported by the REST data connector
 *
 * @type {*[]}
 */
export const supportedSpecs = [
  {
    title       : 'Generic REST API',
    description : 'Connect to any REST API Service that provides a JSON (JavaScript Object Notation) or an XML (eXtensible Markup Language) response.',
    link        : '/rest-explorer',
    identifier  : 'generic_rest',
    enabled     : true
  },
  {
    title          : 'Swagger 2.0',
    description    : 'Connect to any REST API Service that provides a JSON (JavaScript Object Notation) response.',
    link           : '/api-explorer/swagger-2.0',
    identifier     : 'swagger-2.0',
    specIdentifier : 'swagger_2',
    enabled        : true
  },
  {
    title          : 'Open API 3.0',
    description    : 'The OpenAPI Specification (OAS) defines a standard, language-agnostic interface to RESTful APIs.',
    link           : '/api-explorer/open-api-3.0',
    identifier     : 'open-api-3.0',
    specIdentifier : 'openapi_3',
    enabled        : true
  },
  {
    title          : 'API Blueprint',
    description    : 'API Blueprint is a powerful high-level API description language for web APIs. API Blueprint is simple and accessible to everybody involved in the API lifecycle.',
    link           : '/',
    identifier     : 'api-blueprint',
    specIdentifier : 'api_blueprint',
    enabled        : false
  },
  {
    title          : 'Swagger 1.0',
    description    : 'The initial release of the Swagger (currently known as the OpenAPI) specification.',
    link           : '/api-explorer/swagger-1.0',
    identifier     : 'swagger-1.0',
    specIdentifier : 'swagger_1',
    enabled        : false
  },
  {
    title          : 'RAML',
    description    : 'RESTful API Modeling Language is a YAML-based language for describing RESTful APIs. It provides all the information necessary to describe RESTful or practically RESTful API.',
    link           : '/api-explorer/raml',
    identifier     : 'raml',
    specIdentifier : 'raml',
    enabled        : false
  }

];
