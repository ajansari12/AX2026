import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2, Plus, Settings, Trash2, Check, X, RefreshCw,
  ExternalLink, Key, Webhook, AlertCircle, Clock, Zap,
  MessageSquare, Send, Copy, Eye, EyeOff
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Integration {
  id: string;
  name: string;
  display_name: string;
  is_enabled: boolean;
  config: Record<string, any>;
  field_mapping: Record<string, string>;
  sync_direction: 'push' | 'pull' | 'bidirectional';
  last_sync_at: string | null;
  last_sync_status: string | null;
  last_sync_error: string | null;
}

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  secret: string | null;
  events: string[];
  is_enabled: boolean;
  headers: Record<string, string>;
}

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  permissions: string[];
  rate_limit: number;
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

const INTEGRATION_ICONS: Record<string, React.ReactNode> = {
  hubspot: <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">H</div>,
  pipedrive: <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">P</div>,
  zapier: <Zap className="w-8 h-8 text-orange-500" />,
  slack: <MessageSquare className="w-8 h-8 text-purple-500" />,
  discord: <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">D</div>,
};

const WEBHOOK_EVENTS = [
  { id: 'lead.created', label: 'Lead Created' },
  { id: 'lead.updated', label: 'Lead Updated' },
  { id: 'lead.deleted', label: 'Lead Deleted' },
  { id: 'booking.created', label: 'Booking Created' },
  { id: 'booking.updated', label: 'Booking Updated' },
  { id: 'subscriber.created', label: 'Newsletter Subscriber' },
  { id: 'chat.started', label: 'Chat Started' },
  { id: 'chat.completed', label: 'Chat Completed' },
];

export const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'integrations' | 'webhooks' | 'api'>('integrations');
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<WebhookConfig | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [intRes, whRes, keyRes] = await Promise.all([
        supabase.from('integrations').select('*'),
        supabase.from('webhooks').select('*').order('created_at', { ascending: false }),
        supabase.from('api_keys').select('*').order('created_at', { ascending: false }),
      ]);

      setIntegrations(intRes.data || []);
      setWebhooks(whRes.data || []);
      setApiKeys(keyRes.data || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIntegration = async (integration: Integration) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ is_enabled: !integration.is_enabled })
        .eq('id', integration.id);

      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error toggling integration:', err);
    }
  };

  const saveIntegrationConfig = async (id: string, config: Record<string, any>) => {
    try {
      const { error } = await supabase
        .from('integrations')
        .update({ config, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
      setShowConfigModal(false);
      fetchData();
    } catch (err) {
      console.error('Error saving config:', err);
    }
  };

  const saveWebhook = async (webhook: Partial<WebhookConfig>) => {
    try {
      if (editingWebhook?.id) {
        const { error } = await supabase
          .from('webhooks')
          .update(webhook)
          .eq('id', editingWebhook.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('webhooks').insert(webhook);
        if (error) throw error;
      }
      setShowWebhookModal(false);
      setEditingWebhook(null);
      fetchData();
    } catch (err) {
      console.error('Error saving webhook:', err);
    }
  };

  const deleteWebhook = async (id: string) => {
    if (!confirm('Delete this webhook?')) return;
    try {
      const { error } = await supabase.from('webhooks').delete().eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error deleting webhook:', err);
    }
  };

  const generateApiKey = async (name: string, permissions: string[]) => {
    try {
      // Generate a random API key
      const key = `ax_${Array.from(crypto.getRandomValues(new Uint8Array(24)))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')}`;
      const keyPrefix = key.substring(0, 10);

      // Hash the key (in production, use proper hashing)
      const keyHash = btoa(key);

      const { error } = await supabase.from('api_keys').insert({
        name,
        key_hash: keyHash,
        key_prefix: keyPrefix,
        permissions,
      });

      if (error) throw error;

      setNewApiKey(key);
      fetchData();
    } catch (err) {
      console.error('Error generating API key:', err);
    }
  };

  const revokeApiKey = async (id: string) => {
    if (!confirm('Revoke this API key? This cannot be undone.')) return;
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
      fetchData();
    } catch (err) {
      console.error('Error revoking key:', err);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Integrations</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Connect external services and manage API access
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'integrations', label: 'CRM Integrations', icon: Link2 },
          { id: 'webhooks', label: 'Webhooks', icon: Webhook },
          { id: 'api', label: 'API Keys', icon: Key },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <>
          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations.map((integration) => (
                <div
                  key={integration.id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {INTEGRATION_ICONS[integration.name] || <Link2 className="w-8 h-8" />}
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {integration.display_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {integration.is_enabled ? 'Connected' : 'Not connected'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleIntegration(integration)}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        integration.is_enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          integration.is_enabled ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {integration.last_sync_at && (
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <Clock className="w-3 h-3" />
                      Last sync: {new Date(integration.last_sync_at).toLocaleString()}
                      {integration.last_sync_status === 'error' && (
                        <AlertCircle className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedIntegration(integration);
                        setShowConfigModal(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200"
                    >
                      <Settings className="w-4 h-4" />
                      Configure
                    </button>
                    {integration.is_enabled && (
                      <button
                        onClick={() => {/* Trigger sync */}}
                        className="px-3 py-2 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg hover:bg-blue-200"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Webhooks Tab */}
          {activeTab === 'webhooks' && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => {
                    setEditingWebhook(null);
                    setShowWebhookModal(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Add Webhook
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {webhooks.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Webhook className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No webhooks configured</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {webhooks.map((webhook) => (
                      <div key={webhook.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {webhook.name}
                              </h3>
                              {webhook.is_enabled ? (
                                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                  Active
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">
                                  Disabled
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 font-mono mt-1">{webhook.url}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {webhook.events.map((event) => (
                                <span
                                  key={event}
                                  className="px-2 py-0.5 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded"
                                >
                                  {event}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingWebhook(webhook);
                                setShowWebhookModal(true);
                              }}
                              className="p-2 text-gray-400 hover:text-gray-600"
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteWebhook(webhook.id)}
                              className="p-2 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <div>
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setShowApiKeyModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  Generate API Key
                </button>
              </div>

              {newApiKey && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-green-800 dark:text-green-300">
                        API Key Generated
                      </h4>
                      <p className="text-sm text-green-700 dark:text-green-400 mb-2">
                        Copy this key now. You won't be able to see it again.
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 p-2 bg-white dark:bg-gray-800 rounded font-mono text-sm">
                          {newApiKey}
                        </code>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(newApiKey);
                          }}
                          className="p-2 bg-green-600 text-white rounded-lg"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <button onClick={() => setNewApiKey(null)} className="text-green-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {apiKeys.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Key className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No API keys generated</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {apiKeys.map((key) => (
                      <div key={key.id} className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-gray-900 dark:text-white">
                                {key.name}
                              </h3>
                              {key.is_active ? (
                                <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                                  Active
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 text-xs bg-red-100 text-red-700 rounded-full">
                                  Revoked
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 font-mono mt-1">
                              {key.key_prefix}...
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                              <span>Permissions: {key.permissions.join(', ')}</span>
                              <span>Rate limit: {key.rate_limit}/hr</span>
                              {key.last_used_at && (
                                <span>
                                  Last used: {new Date(key.last_used_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                          {key.is_active && (
                            <button
                              onClick={() => revokeApiKey(key.id)}
                              className="px-3 py-1.5 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* API Documentation Link */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">API Documentation</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Learn how to integrate with our API to access leads, bookings, and more.
                </p>
                <a
                  href="/api/docs"
                  target="_blank"
                  className="inline-flex items-center gap-2 text-blue-600 hover:underline"
                >
                  View API Docs <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}
        </>
      )}

      {/* Configuration Modal */}
      <AnimatePresence>
        {showConfigModal && selectedIntegration && (
          <IntegrationConfigModal
            integration={selectedIntegration}
            onClose={() => {
              setShowConfigModal(false);
              setSelectedIntegration(null);
            }}
            onSave={saveIntegrationConfig}
          />
        )}
      </AnimatePresence>

      {/* Webhook Modal */}
      <AnimatePresence>
        {showWebhookModal && (
          <WebhookModal
            webhook={editingWebhook}
            onClose={() => {
              setShowWebhookModal(false);
              setEditingWebhook(null);
            }}
            onSave={saveWebhook}
          />
        )}
      </AnimatePresence>

      {/* API Key Modal */}
      <AnimatePresence>
        {showApiKeyModal && (
          <ApiKeyModal
            onClose={() => setShowApiKeyModal(false)}
            onGenerate={generateApiKey}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Integration Config Modal
const IntegrationConfigModal: React.FC<{
  integration: Integration;
  onClose: () => void;
  onSave: (id: string, config: Record<string, any>) => void;
}> = ({ integration, onClose, onSave }) => {
  const [config, setConfig] = useState(integration.config || {});
  const [showSecrets, setShowSecrets] = useState(false);

  const getConfigFields = () => {
    switch (integration.name) {
      case 'hubspot':
        return [
          { key: 'api_key', label: 'API Key', type: 'password' },
          { key: 'portal_id', label: 'Portal ID', type: 'text' },
        ];
      case 'pipedrive':
        return [
          { key: 'api_token', label: 'API Token', type: 'password' },
          { key: 'company_domain', label: 'Company Domain', type: 'text' },
        ];
      case 'zapier':
        return [{ key: 'webhook_url', label: 'Webhook URL', type: 'url' }];
      case 'slack':
        return [
          { key: 'webhook_url', label: 'Webhook URL', type: 'url' },
          { key: 'channel', label: 'Channel', type: 'text' },
        ];
      case 'discord':
        return [{ key: 'webhook_url', label: 'Webhook URL', type: 'url' }];
      default:
        return [];
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Configure {integration.display_name}
          </h3>

          <div className="space-y-4">
            {getConfigFields().map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.type === 'password' && !showSecrets ? 'password' : 'text'}
                    value={config[field.key] || ''}
                    onChange={(e) => setConfig({ ...config, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  {field.type === 'password' && (
                    <button
                      type="button"
                      onClick={() => setShowSecrets(!showSecrets)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                    >
                      {showSecrets ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(integration.id, config)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Webhook Modal
const WebhookModal: React.FC<{
  webhook: WebhookConfig | null;
  onClose: () => void;
  onSave: (webhook: Partial<WebhookConfig>) => void;
}> = ({ webhook, onClose, onSave }) => {
  const [name, setName] = useState(webhook?.name || '');
  const [url, setUrl] = useState(webhook?.url || '');
  const [events, setEvents] = useState<string[]>(webhook?.events || []);
  const [isEnabled, setIsEnabled] = useState(webhook?.is_enabled ?? true);

  const toggleEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.includes(eventId) ? prev.filter((e) => e !== eventId) : [...prev, eventId]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {webhook ? 'Edit Webhook' : 'New Webhook'}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="My Webhook"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm"
                placeholder="https://example.com/webhook"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Events
              </label>
              <div className="grid grid-cols-2 gap-2">
                {WEBHOOK_EVENTS.map((event) => (
                  <label
                    key={event.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={events.includes(event.id)}
                      onChange={() => toggleEvent(event.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {event.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isEnabled}
                onChange={(e) => setIsEnabled(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Enabled</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({ name, url, events, is_enabled: isEnabled })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!name || !url || events.length === 0}
            >
              {webhook ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// API Key Modal
const ApiKeyModal: React.FC<{
  onClose: () => void;
  onGenerate: (name: string, permissions: string[]) => void;
}> = ({ onClose, onGenerate }) => {
  const [name, setName] = useState('');
  const [permissions, setPermissions] = useState<string[]>(['read']);

  const togglePermission = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.95 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Generate API Key
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Key Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Production API Key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Permissions
              </label>
              <div className="space-y-2">
                {['read', 'write', 'delete'].map((perm) => (
                  <label key={perm} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={permissions.includes(perm)}
                      onChange={() => togglePermission(perm)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                      {perm}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onGenerate(name, permissions);
                onClose();
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              disabled={!name}
            >
              Generate
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
