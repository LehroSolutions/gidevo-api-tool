import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { GoStrategy } from '../src/core/strategies/GoStrategy';

describe('GoStrategy', () => {
  const fixtureSpecPath = path.resolve(__dirname, 'fixtures', 'api.yaml');
  const petstoreSpecPath = path.resolve(__dirname, '..', 'examples', 'specs', 'petstore.yaml');
  const tmpOutput = path.resolve(__dirname, 'tmp-go-strategy');

  beforeEach(() => {
    if (fs.existsSync(tmpOutput)) {
      fs.rmSync(tmpOutput, { recursive: true, force: true });
    }
    fs.mkdirSync(tmpOutput, { recursive: true });
  });

  afterEach(() => {
    if (fs.existsSync(tmpOutput)) {
      fs.rmSync(tmpOutput, { recursive: true, force: true });
    }
  });

  it('generates client.go and types.go', async () => {
    const strategy = new GoStrategy();
    const specContent = fs.readFileSync(fixtureSpecPath, 'utf8');
    const spec = yaml.load(specContent);

    await strategy.generate(spec, tmpOutput);

    const clientPath = path.join(tmpOutput, 'client.go');
    const typesPath = path.join(tmpOutput, 'types.go');
    expect(fs.existsSync(clientPath)).toBe(true);
    expect(fs.existsSync(typesPath)).toBe(true);

    expect(fs.readFileSync(clientPath, 'utf8')).toMatchSnapshot();
    expect(fs.readFileSync(typesPath, 'utf8')).toMatchSnapshot();
  });

  it('skips path-level parameters and emits aliases for enums and maps', async () => {
    const strategy = new GoStrategy();
    const specContent = fs.readFileSync(petstoreSpecPath, 'utf8');
    const spec = yaml.load(specContent);

    await strategy.generate(spec, tmpOutput);

    const clientContent = fs.readFileSync(path.join(tmpOutput, 'client.go'), 'utf8');
    const typesContent = fs.readFileSync(path.join(tmpOutput, 'types.go'), 'utf8');

    expect(clientContent).not.toContain('ParametersPetsPetId');
    expect(clientContent).toContain('func (c *ApiClient) GetPetsPetId()');
    expect(typesContent).toContain('type PetStatus string');
    expect(typesContent).toContain('PetStatusAvailable PetStatus = "available"');
    expect(typesContent).toContain('type Inventory map[string]int');
  });
});
