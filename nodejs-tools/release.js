import { execSync } from 'child_process'
import { existsSync, readFileSync, writeFileSync } from 'fs'
import prompts from 'prompts'

const packagePath = 'package.json'
const iosProjectPath = 'ios/App/App.xcodeproj/project.pbxproj'
const androidGradlePath = 'android/app/build.gradle'

// Read current version from package.json
const pkg = JSON.parse( readFileSync( packagePath, 'utf-8' ) )
const currentVersion = pkg.version
const [major, minor, patch] = currentVersion.split( '.' ).map( Number )

console.log( `\nCurrent version: ${currentVersion}\n` )

// Prompt for version bump type
const response = await prompts( {
	type: 'select',
	name: 'bump',
	message: 'Select version bump',
	choices: [
		{ title: `patch (${major}.${minor}.${patch + 1})`, value: 'patch' },
		{ title: `minor (${major}.${minor + 1}.0)`, value: 'minor' },
		{ title: `major (${major + 1}.0.0)`, value: 'major' },
	],
} )

if ( !response.bump ) {
	console.log( 'Release cancelled.' )
	process.exit( 0 )
}

// Calculate new version
let newVersion
switch ( response.bump ) {
	case 'major':
		newVersion = `${major + 1}.0.0`
		break
	case 'minor':
		newVersion = `${major}.${minor + 1}.0`
		break
	case 'patch':
		newVersion = `${major}.${minor}.${patch + 1}`
		break
}

console.log( `\nBumping to ${newVersion}...\n` )

// Update package.json
pkg.version = newVersion
writeFileSync( packagePath, JSON.stringify( pkg, null, '\t' ) + '\n' )
console.log( `✅ package.json: ${currentVersion} → ${newVersion}` )

// Update iOS
if ( existsSync( iosProjectPath ) ) {
	try {
		// Update MARKETING_VERSION in project.pbxproj
		let pbxproj = readFileSync( iosProjectPath, 'utf-8' )
		pbxproj = pbxproj.replace(
			/MARKETING_VERSION = [\d.]+;/g,
			`MARKETING_VERSION = ${newVersion};`,
		)
		writeFileSync( iosProjectPath, pbxproj )

		// Get current build number and increment
		const currentBuild = execSync(
			`xcodebuild -project ios/App/App.xcodeproj -showBuildSettings 2>/dev/null | grep CURRENT_PROJECT_VERSION | awk '{print $3}' | head -1`,
			{ encoding: 'utf-8' },
		).trim()

		const newBuild = currentBuild ? parseInt( currentBuild ) + 1 : 1
		execSync( `cd ios/App && xcrun agvtool new-version -all ${newBuild}`, { stdio: 'pipe' } )

		console.log( `✅ iOS: ${newVersion} (build ${newBuild})` )
	} catch ( error ) {
		console.error( `❌ iOS update failed: ${error.message}` )
	}
} else {
	console.log( '⚠️  iOS project not found, skipping' )
}

// Update Android
if ( existsSync( androidGradlePath ) ) {
	try {
		let gradle = readFileSync( androidGradlePath, 'utf-8' )

		// Get current versionCode
		const versionCodeMatch = gradle.match( /versionCode (\d+)/ )
		const currentCode = versionCodeMatch ? parseInt( versionCodeMatch[ 1 ] ) : 0
		const newCode = currentCode + 1

		// Update versionCode and versionName
		gradle = gradle.replace( /versionCode \d+/, `versionCode ${newCode}` )
		gradle = gradle.replace( /versionName "[^"]+"/, `versionName "${newVersion}"` )

		writeFileSync( androidGradlePath, gradle )
		console.log( `✅ Android: ${newVersion} (code ${newCode})` )
	} catch ( error ) {
		console.error( `❌ Android update failed: ${error.message}` )
	}
} else {
	console.log( '⚠️  Android project not found, skipping' )
}

console.log( `\n🎉 Release ${newVersion} ready!\n` )
