import { 
  default as media_helpers
} from './media-helpers.js'
import { getAppRoot } from '../tests/helpers'

describe('Media helpers', function() {
  context('node env = production', function() {
    const media_root = 'dist/client/media'

    beforeEach(function() {
      media_helpers.__Rewire__('mediaRoot', media_root)
    })

    afterEach(function() {
      media_helpers.__ResetDependency__('mediaRoot')
    })

    describe('getPath', function() {
      const getPath = media_helpers.__GetDependency__('getPath')

      it('should return pathname of production environment of type string given a valid filename', function() {
        const filename = 'testfile'
        const expected = getAppRoot(__dirname) + media_root + '/' + filename
        const actual = getPath(filename)

        expect(actual).to.be.a('string')
        expect(actual).to.equal(expected)
      })
    })		
  })

  context('node dev = debug', function() {
    const media_root = 'assets/media'

    beforeEach(function() {
      media_helpers.__Rewire__('mediaRoot', media_root)
    })

    afterEach(function() {
      media_helpers.__ResetDependency__('mediaRoot')
    })		

    describe('getPath', function() {
      const getPath = media_helpers.__GetDependency__('getPath')
			
      it('should return pathname of debug environment', function() {
        const filename = 'testfile'
        const expected = getAppRoot(__dirname) + media_root + '/' + filename
        const actual = getPath(filename)

        expect(actual).to.be.a('string')
        expect(actual).to.equal(expected)
      })
    })
  })
})