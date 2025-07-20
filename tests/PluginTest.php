<?php
/**
 * Test Plugin Initialization
 *
 * @package VanillaBuilder\Tests
 */

use PHPUnit\Framework\TestCase;
use VanillaBuilder\Core\Plugin;

class PluginTest extends TestCase {
    
    /**
     * Test plugin singleton instance
     */
    public function testPluginSingleton() {
        $instance1 = Plugin::getInstance();
        $instance2 = Plugin::getInstance();
        
        $this->assertInstanceOf(Plugin::class, $instance1);
        $this->assertSame($instance1, $instance2);
    }
    
    /**
     * Test plugin version
     */
    public function testPluginVersion() {
        $plugin = Plugin::getInstance();
        $version = $plugin->getVersion();
        
        $this->assertEquals('1.0.0', $version);
    }
    
    /**
     * Test plugin URL
     */
    public function testPluginUrl() {
        $plugin = Plugin::getInstance();
        $url = $plugin->getPluginUrl();
        
        $this->assertStringContains('vanilla-builder', $url);
    }
    
    /**
     * Test plugin directory
     */
    public function testPluginDir() {
        $plugin = Plugin::getInstance();
        $dir = $plugin->getPluginDir();
        
        $this->assertStringContains('vanilla-builder', $dir);
        $this->assertStringEndsWith('/', $dir);
    }
}